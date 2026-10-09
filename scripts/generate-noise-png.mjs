import fs from "fs"
import path from "path"
import zlib from "zlib"

// Generate a valid 128x128 grayscale PNG image with uniform random noise
function createNoisePng(width = 128, height = 128) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 79, 13, 10, 26, 10])

  // IHDR chunk: 128x128, 8-bit depth, color type 0 (grayscale)
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8 // bit depth
  ihdrData[9] = 0 // color type 0: grayscale
  ihdrData[10] = 0 // compression method
  ihdrData[11] = 0 // filter method
  ihdrData[12] = 0 // interlace method

  function createChunk(type, data) {
    const len = data.length
    const buf = Buffer.alloc(4 + 4 + len + 4)
    buf.writeUInt32BE(len, 0)
    buf.write(type, 4, 4, "ascii")
    data.copy(buf, 8)

    // Compute CRC32
    let crc = 0xffffffff
    for (let i = 4; i < 8 + len; i++) {
      let byte = buf[i]
      crc = crc ^ byte
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320)
      }
    }
    buf.writeInt32BE(~crc, 8 + len)
    return buf
  }

  const ihdrChunk = createChunk("IHDR", ihdrData)

  // Scanlines with filter byte 0 (None)
  const rawData = Buffer.alloc((width + 1) * height)
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width + 1)
    rawData[rowOffset] = 0 // filter byte 0
    for (let x = 0; x < width; x++) {
      // Deterministic pseudo-random noise value
      const rand = Math.floor(Math.random() * 256)
      rawData[rowOffset + 1 + x] = rand
    }
  }

  const compressed = zlib.deflateSync(rawData)
  const idatChunk = createChunk("IDAT", compressed)
  const iendChunk = createChunk("IEND", Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

const png = createNoisePng(128, 128)
const outPath = path.join(process.cwd(), "public", "noise.png")
fs.writeFileSync(outPath, png)
console.log(`Generated 128x128 noise PNG at ${outPath} (${png.length} bytes)`)
