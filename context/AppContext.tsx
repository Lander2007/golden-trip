"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import {
  Car,
  Booking,
  User,
  MOCK_CARS,
  MOCK_USER,
  SEED_BOOKINGS,
  Review,
} from "@/lib/mockData"

export interface ToastItem {
  id: string
  message: string
  type: "success" | "info" | "error"
}

interface AppContextType {
  // Auth state
  currentUser: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  login: (identifier: string, pass: string, customName?: string) => Promise<boolean>
  demoLogin: () => Promise<void>
  signup: (userData: { name: string; email: string; phone: string; nationalId?: string; licenseNumber?: string }) => Promise<boolean>
  logout: () => void

  // Cars & reviews state
  cars: Car[]
  getCarById: (id: string) => Car | undefined
  addCarReview: (carId: string, rating: number, comment: string, reviewerName: string) => void

  // Bookings state
  bookings: Booking[]
  createBooking: (bookingData: Omit<Booking, "id" | "createdAt" | "status">) => Promise<Booking>
  cancelBooking: (bookingId: string) => boolean
  reviewBooking: (bookingId: string, rating: number, comment: string) => boolean

  // Search & dates state
  pickupBranch: string
  setPickupBranch: (branchId: string) => void
  returnBranch: string
  setReturnBranch: (branchId: string) => void
  pickupDate: string
  setPickupDate: (date: string) => void
  returnDate: string
  setReturnDate: (date: string) => void

  // Toast notifications
  toasts: ToastItem[]
  showToast: (message: string, type?: "success" | "info" | "error") => void
  removeToast: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const USER_STORAGE_KEY = "gt_prototype_user"
const BOOKINGS_STORAGE_KEY = "gt_prototype_bookings"
const CARS_STORAGE_KEY = "gt_prototype_cars"

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS)
  const [cars, setCars] = useState<Car[]>(MOCK_CARS)
  const [isHydrated, setIsHydrated] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // Default dates: tomorrow and 3 days later
  const [pickupBranch, setPickupBranch] = useState("alexandria")
  const [returnBranch, setReturnBranch] = useState("alexandria")
  const [pickupDate, setPickupDate] = useState("2026-10-12")
  const [returnDate, setReturnDate] = useState("2026-10-15")

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser))
      }

      const storedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY)
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings))
      } else {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(SEED_BOOKINGS))
      }

      const storedCars = localStorage.getItem(CARS_STORAGE_KEY)
      if (storedCars) {
        setCars(JSON.parse(storedCars))
      } else {
        localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(MOCK_CARS))
      }

      // Initialize default dates based on today's date
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const returnD = new Date(today)
      returnD.setDate(returnD.getDate() + 4)

      setPickupDate(tomorrow.toISOString().split("T")[0])
      setReturnDate(returnD.toISOString().split("T")[0])
    } catch (err) {
      console.warn("Could not read from localStorage:", err)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const demoLogin = async () => {
    // Artificial small delay for realism
    await new Promise((r) => setTimeout(r, 400))
    setCurrentUser(MOCK_USER)
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(MOCK_USER))
    } catch (e) {
      console.error(e)
    }
    showToast(`مرحباً بك مجدداً، ${MOCK_USER.name}! تم تسجيل الدخول بنجاح`, "success")
  }

  const login = async (identifier: string, _pass: string, customName?: string) => {
    await new Promise((r) => setTimeout(r, 450))
    const userName = customName || (identifier.includes("@") ? identifier.split("@")[0] : "أحمد محمود")
    const user: User = {
      id: "user-" + Date.now(),
      name: userName,
      email: identifier.includes("@") ? identifier : `${identifier}@goldentrip.eg`,
      phone: identifier.includes("@") ? "010 1234 5678" : identifier,
      nationalId: "29508140102345",
      licenseNumber: "DL-EGY-89420",
    }
    setCurrentUser(user)
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    } catch (e) {
      console.error(e)
    }
    showToast(`تم تسجيل الدخول بنجاح! أهلاً بك يا ${user.name}`, "success")
    return true
  }

  const signup = async (userData: {
    name: string
    email: string
    phone: string
    nationalId?: string
    licenseNumber?: string
  }) => {
    await new Promise((r) => setTimeout(r, 500))
    const user: User = {
      id: "user-" + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      nationalId: userData.nationalId || "29508140102345",
      licenseNumber: userData.licenseNumber || "DL-EGY-" + Math.floor(10000 + Math.random() * 90000),
    }
    setCurrentUser(user)
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    } catch (e) {
      console.error(e)
    }
    showToast(`تم إنشاء الحساب بنجاح! أهلاً بك في جولدن تريب، ${user.name}`, "success")
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    try {
      localStorage.removeItem(USER_STORAGE_KEY)
    } catch (e) {
      console.error(e)
    }
    showToast("تم تسجيل الخروج بنجاح. نتمنى رؤيتك قريباً", "info")
  }

  const getCarById = (id: string): Car | undefined => {
    return cars.find((c) => c.id === id)
  }

  const addCarReview = (carId: string, rating: number, comment: string, reviewerName: string) => {
    const newRev: Review = {
      id: "rev-" + Date.now(),
      userName: reviewerName,
      rating,
      date: new Date().toISOString().split("T")[0],
      comment,
    }

    setCars((prevCars) => {
      const updated = prevCars.map((car) => {
        if (car.id === carId) {
          const newReviews = [newRev, ...car.reviews]
          const sum = newReviews.reduce((acc, r) => acc + r.rating, 0)
          const newRating = Number((sum / newReviews.length).toFixed(1))
          return {
            ...car,
            rating: newRating,
            reviews: newReviews,
          }
        }
        return car
      })
      try {
        localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }

  const createBooking = async (
    bookingData: Omit<Booking, "id" | "createdAt" | "status">
  ): Promise<Booking> => {
    await new Promise((r) => setTimeout(r, 600))
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const newBooking: Booking = {
      ...bookingData,
      id: `GT-2026-${randomNum}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "مؤكد",
    }

    setBookings((prev) => {
      const updated = [newBooking, ...prev]
      try {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })

    showToast(`تم تأكيد الحجز بنجاح! رقم الحجز: ${newBooking.id}`, "success")
    return newBooking
  }

  const cancelBooking = (bookingId: string): boolean => {
    let found = false
    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.id === bookingId) {
          found = true
          return { ...b, status: "ملغي" as const }
        }
        return b
      })
      try {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })

    if (found) {
      showToast(`تم إلغاء الحجز رقم ${bookingId} بنجاح`, "info")
    }
    return found
  }

  const reviewBooking = (bookingId: string, rating: number, comment: string): boolean => {
    let carIdToUpdate: string | null = null
    const reviewDate = new Date().toISOString().split("T")[0]

    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.id === bookingId) {
          carIdToUpdate = b.carId
          return {
            ...b,
            userReview: {
              rating,
              comment,
              date: reviewDate,
            },
          }
        }
        return b
      })
      try {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })

    if (carIdToUpdate && currentUser) {
      addCarReview(carIdToUpdate, rating, comment, currentUser.name)
      showToast("شكراً لتقييمك! تم نشر مراجعتك بنجاح على صفحة السيارة", "success")
      return true
    }
    return false
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isHydrated,
        login,
        demoLogin,
        signup,
        logout,
        cars,
        getCarById,
        addCarReview,
        bookings,
        createBooking,
        cancelBooking,
        reviewBooking,
        pickupBranch,
        setPickupBranch,
        returnBranch,
        setReturnBranch,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
