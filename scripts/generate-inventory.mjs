import ts from "typescript"
import fs from "fs"
import path from "path"

function getFiles(dir) {
  let results = []
  if (!fs.existsSync(dir)) return results
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath))
    } else {
      if (/\.(tsx?)$/.test(file)) results.push(fullPath)
    }
  })
  return results
}

const files = [
  ...getFiles("app"),
  ...getFiles("components"),
  ...getFiles("lib"),
  ...getFiles("context"),
]

let inventory = []

files.forEach((filePath) => {
  const normPath = filePath.replace(/\\/g, "/")
  const code = fs.readFileSync(filePath, "utf8")
  const sourceFile = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true)

  function getLine(pos) {
    return sourceFile.getLineAndCharacterOfPosition(pos).line + 1
  }

  function add(line, str, context) {
    if (!str || typeof str !== "string") return
    const trimmed = str.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim()
    if (!trimmed) return
    // avoid duplicates on exact file+line+string
    if (inventory.some((i) => i.file === normPath && i.line === line && i.string === trimmed)) return
    inventory.push({ file: normPath, line, string: trimmed, context })
  }

  function walk(node) {
    // 1. JSXText
    if (ts.isJsxText(node)) {
      const t = node.text.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim()
      if (t && !/^[\s{}()·|\\\/]+$/.test(t) && t !== "↗" && t !== "↘" && t !== "→" && t !== "←" && t !== "·" && t !== "|") {
        add(getLine(node.getStart()), t, "JSX Text")
      }
    }
    // 2. JSXAttribute
    else if (ts.isJsxAttribute(node)) {
      const attrName = node.name.getText(sourceFile)
      if (["placeholder", "aria-label", "alt", "title", "label"].includes(attrName) && node.initializer) {
        if (ts.isStringLiteral(node.initializer)) {
          add(getLine(node.initializer.getStart()), node.initializer.text, `Attr: ${attrName}`)
        } else if (ts.isJsxExpression(node.initializer) && node.initializer.expression) {
          if (ts.isStringLiteral(node.initializer.expression)) {
            add(getLine(node.initializer.expression.getStart()), node.initializer.expression.text, `Attr: ${attrName}`)
          } else if (ts.isTemplateExpression(node.initializer.expression)) {
            add(getLine(node.initializer.expression.getStart()), node.initializer.expression.getText(sourceFile), `Attr: ${attrName}`)
          }
        }
      }
    }
    // 3. String literals in config and metadata properties
    else if (ts.isPropertyAssignment(node)) {
      const propName = node.name.getText(sourceFile)
      // Metadata
      if (["title", "description", "siteName"].includes(propName) && ts.isStringLiteral(node.initializer)) {
        add(getLine(node.initializer.getStart()), node.initializer.text, `Metadata: ${propName}`)
      }
      // Config data
      if ([
        "name", "city", "address", "operatingHours", "type", "transmission", "fuel",
        "features", "comment", "tagline", "driveTime", "corridor", "hubs",
        "recommendedVehicle", "copy", "text", "detail", "notes", "label", "heading", "subtitle"
      ].includes(propName)) {
        if (ts.isStringLiteral(node.initializer)) {
          add(getLine(node.initializer.getStart()), node.initializer.text, `Config: ${propName}`)
        } else if (ts.isArrayLiteralExpression(node.initializer)) {
          node.initializer.elements.forEach((el) => {
            if (ts.isStringLiteral(el)) {
              add(getLine(el.getStart()), el.text, `Config: ${propName}`)
            }
          })
        }
      }
    }
    // 4. Assignments to errors, e.g. newErrors.xxx = '...'
    else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      const leftText = node.left.getText(sourceFile)
      if ((leftText.includes("newErrors") || leftText.includes("errors")) && ts.isStringLiteral(node.right)) {
        add(getLine(node.right.getStart()), node.right.text, "Validation Error")
      }
    }
    // 5. Calls to showToast('...')
    else if (ts.isCallExpression(node)) {
      const fnName = node.expression.getText(sourceFile)
      if (fnName.includes("showToast") || fnName.includes("toast")) {
        const firstArg = node.arguments[0]
        if (firstArg) {
          if (ts.isStringLiteral(firstArg)) {
            add(getLine(firstArg.getStart()), firstArg.text, "Toast")
          } else if (ts.isTemplateExpression(firstArg)) {
            add(getLine(firstArg.getStart()), firstArg.getText(sourceFile), "Toast")
          }
        }
      }
    }
    // 6. Hardcoded route array strings in RouteBoard, RouteProgressLine, etc.
    else if (ts.isArrayLiteralExpression(node)) {
      const parent = node.parent
      if (parent && ts.isVariableDeclaration(parent)) {
        const varName = parent.name.getText(sourceFile)
        if (["route", "motionNotes"].includes(varName)) {
          node.elements.forEach((el) => {
            if (ts.isStringLiteral(el)) {
              add(getLine(el.getStart()), el.text, `Array: ${varName}`)
            }
          })
        }
      }
    }

    ts.forEachChild(node, walk)
  }

  walk(sourceFile)
})

// Sort inventory by file, then line
inventory.sort((a, b) => {
  if (a.file !== b.file) return a.file.localeCompare(b.file)
  return a.line - b.line
})

console.log(`TOTAL USER-FACING STRINGS FOUND: ${inventory.length}`)

let md = `# Golden Trip — i18n String Inventory\n\n`
md += `**Total user-facing strings:** ${inventory.length}\n\n`
md += `Generated for Step 1 of the English/Arabic internationalization task.\n\n`
md += `| # | File | Line | Context | String |\n`
md += `|---|------|------|---------|--------|\n`

inventory.forEach((item, idx) => {
  const safeStr = item.string
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ")
  md += `| ${idx + 1} | \`${item.file}\` | ${item.line} | ${item.context} | ${safeStr} |\n`
})

fs.writeFileSync("i18n-inventory.md", md, "utf8")
console.log("Saved inventory to i18n-inventory.md")
