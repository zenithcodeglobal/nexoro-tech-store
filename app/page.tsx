"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

export default function Home() {
  // Font will be imported directly via style tag
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSideCartOpen, setIsSideCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const [isDarkMode, setIsDarkMode] = useState(false)

  type CartItem = {
    id: number
    name: string
    price: number
    image: string
    quantity: number
  }

  const products = [
    {
      id: 1,
      name: "Premium Smartwatch",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1627040849263-b94ab1502618?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      name: "Wireless Headphones",
      price: 180.99,
      image:
        "https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 3,
      name: "D-Link Router",
      price: 149.99,
      image:
        "https://images.unsplash.com/photo-1620423855978-e5d74a7bef30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGVsZWN0cm9uaWMlMjBnYWRnZXR8ZW58MHwxfDB8fHww",
    },
    {
      id: 4,
      name: "Portable Air Cooler",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1730299788623-12cded84cf40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGFpciUyMGNvb2xlcnxlbnwwfDF8MHx8fDA%3D",
    },
    {
      id: 5,
      name: "Ultra HD Camera",
      price: 349.99,
      image:
        "https://images.unsplash.com/photo-1467244757843-7d30a709703e?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 6,
      name: "Virtual Reality",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1696429175928-793a1cdef1d3?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 7,
      name: "Retro Tech",
      price: 230.99,
      image:
        "https://images.unsplash.com/photo-1596998791568-386ef5297c2e?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ]

  const [filteredProducts, setFilteredProducts] = useState(products)

  const reviews = [
    {
      id: 1,
      text: "Nexoro always delivers top-notch quality, and my smartwatch feels premium and functions smoothly—truly absolute great value for its affordable price.",
      name: "Olivia Carter",
      title: "Digital Marketer",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 2,
      text: "The wireless earphones I purchased exceeded my expectations. The sound quality is incredible and the battery life is impressive. Nexoro has become my go-to tech store.",
      name: "James Wilson",
      title: "Sound Engineer",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop",
    },
  ]

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const [activeButton, setActiveButton] = useState("next")

  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  })

  const searchRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const showToast = (message: string) => {
    setToast({ visible: true, message })
    setTimeout(() => {
      setToast({ visible: false, message: "" })
    }, 3000)
  }

  const addToCart = (product: { id: number; name: string; price: number; image: string }) => {
    const existingProduct = cartItems.find((item) => item.id === product.id)

    if (existingProduct) {
      updateCartItemQuantity(product.id, existingProduct.quantity + 1)
      showToast(`Added another ${product.name} to your cart`)
    } else {
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }])
      showToast(`${product.name} added to your cart`)
    }
  }

  const showNextReview = () => {
    if (isAnimating || activeButton === "next") return
    setIsAnimating(true)
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
    setActiveButton("next")
  }

  const showPrevReview = () => {
    if (isAnimating || activeButton === "prev") return
    setIsAnimating(true)
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
    setActiveButton("prev")
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [currentReviewIndex])

  const handleNewsletterSubmit = () => {
    if (!email) return

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
      setEmail("")

      setTimeout(() => {
        setIsSubscribed(false)
      }, 5000)
    }, 1000)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === "") {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
      setFilteredProducts(filtered)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const updateCartItemQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== item.id))
  }

  const validateCheckoutForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!cardDetails.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required"
    } else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Card number must be 16 digits"
    }

    if (!cardDetails.cardHolder.trim()) {
      newErrors.cardHolder = "Cardholder name is required"
    }

    if (!cardDetails.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = "Use MM/YY format"
    }

    if (!cardDetails.cvv.trim()) {
      newErrors.cvv = "CVV is required"
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateCheckoutForm()) {
      setIsProcessingPayment(true)

      setTimeout(() => {
        setIsProcessingPayment(false)
        setCheckoutStep(2)

        setCardDetails({
          cardNumber: "",
          cardHolder: "",
          expiryDate: "",
          cvv: "",
        })

        setTimeout(() => {
          setCartItems([])
          setIsCheckoutOpen(false)
          setIsCartOpen(false)
          setCheckoutStep(1)
          showToast("Order placed successfully!")
        }, 3000)
      }, 2000)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "cardNumber") {
      setCardDetails({
        ...cardDetails,
        [name]: formatCardNumber(value),
      })
    } else if (name === "expiryDate") {
      const formatted = value
        .replace(/[^0-9]/g, "")
        .substring(0, 4)
        .replace(/^([0-9]{2})([0-9]{0,2})/, "$1/$2")

      setCardDetails({
        ...cardDetails,
        [name]: formatted,
      })
    } else {
      setCardDetails({
        ...cardDetails,
        [name]: value,
      })
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div
      className={`min-h-screen transition-colors duration-300`}
      style={{
        "--bg-primary": isDarkMode ? "#121212" : "#ffffff",
        "--bg-secondary": isDarkMode ? "#1e1e1e" : "#f8f5ff",
        "--text-primary": isDarkMode ? "#ffffff" : "#1a1a1a",
        "--text-secondary": isDarkMode ? "#e0e0e0" : "#4b5563",
        "--accent-color": "#9333ea",
        "--accent-hover": "#7e22ce",
        "--card-bg": isDarkMode ? "#1e1e1e" : "#ffffff",
        "--border-color": isDarkMode ? "#333333" : "#e5e7eb",
        "--icon-bg": isDarkMode ? "#333333" : "#f3f4f6",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <nav
        className="px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between transition-colors duration-300 sticky top-0 z-50"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Nexoro</span>
          </div>
        </div>

        <div className="hidden lg:flex lg:space-x-8">
          <button
            onClick={() => scrollToSection("popular-products")}
            className="transition-colors cursor-pointer"
            style={{ color: isDarkMode ? "var(--text-secondary)" : "#4b5563" }}
          >
            Tech & Gadgets
          </button>
          <button
            onClick={() => scrollToSection("collections")}
            className="transition-colors cursor-pointer"
            style={{ color: isDarkMode ? "var(--text-secondary)" : "#4b5563" }}
          >
            Popular
          </button>
          <button
            onClick={() => scrollToSection("reviews")}
            className="transition-colors cursor-pointer"
            style={{ color: isDarkMode ? "var(--text-secondary)" : "#4b5563" }}
          >
            Testimonials
          </button>
          <button
            onClick={() => scrollToSection("newsletter")}
            className="transition-colors cursor-pointer"
            style={{ color: isDarkMode ? "var(--text-secondary)" : "#4b5563" }}
          >
            Stay Updated
          </button>
          <button
            onClick={() => scrollToSection("footer")}
            className="transition-colors cursor-pointer"
            style={{ color: isDarkMode ? "var(--text-secondary)" : "#4b5563" }}
          >
            Contact
          </button>
        </div>

        <div className="flex items-center space-x-3 lg:hidden">
          <button
            onClick={toggleDarkMode}
            className="hover:text-purple-600 focus:outline-none transition-colors p-2 cursor-pointer"
            style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen)
              setIsCartOpen(false)
            }}
            className="hover:text-purple-600 focus:outline-none transition-colors p-2 cursor-pointer"
            style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
            aria-label="Search products"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <button
            onClick={() => {
              setIsSideCartOpen(true)
              setIsSearchOpen(false)
            }}
            className="hover:text-purple-600 focus:outline-none transition-colors relative p-2 cursor-pointer"
            style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
            aria-label="View shopping cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-md transition-colors flex items-center cursor-pointer"
          >
            <span className="mr-1 hidden md:inline">Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="hover:text-purple-600 focus:outline-none transition-colors relative mr-4 cursor-pointer"
            style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:text-purple-600 focus:outline-none transition-colors p-2 rounded-full cursor-pointer"
              style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
              aria-label="Search products"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {isSearchOpen && (
              <div
                className="absolute right-0 mt-2 w-96 rounded-lg shadow-lg p-4 z-50 transition-colors duration-300"
                style={{ backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <form onSubmit={handleSearchSubmit}>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      placeholder="Search products..."
                      className="w-full px-4 py-2 focus:outline-none"
                      style={{
                        backgroundColor: isDarkMode ? "#2d2d2d" : "#ffffff",
                        color: isDarkMode ? "#ffffff" : "#000000",
                      }}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="bg-purple-500 text-white p-2 hover:bg-purple-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {searchQuery.trim() !== "" && (
                      <>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                          {filteredProducts.length === 0
                            ? "No products found"
                            : `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`}
                        </h3>

                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center py-2 border-b border-gray-100 last:border-0"
                          >
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md mr-3"
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">{product.name}</h4>
                              <p className="text-purple-600 text-sm font-medium">${product.price.toFixed(2)}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                addToCart(product)
                                showToast(`${product.name} added to your cart`)
                              }}
                              className="ml-2 bg-purple-500 hover:bg-purple-600 h-8 w-8 rounded-full flex items-center justify-center shadow-sm transition-colors"
                              aria-label={`Add ${product.name} to cart`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                    {searchQuery.trim() === "" && (
                      <p className="text-sm text-gray-500 text-center py-4">Type to search products</p>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="relative" ref={cartRef}>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="hover:text-purple-600 focus:outline-none transition-colors relative cursor-pointer"
              style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>

            {isCartOpen && (
              <div
                className="fixed inset-x-0 top-16 mt-2 mx-auto w-[95%] md:w-80 md:right-4 md:left-auto md:absolute rounded-lg shadow-lg p-4 z-50 transition-colors duration-300"
                style={{ backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-3">Your Cart</h3>

                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                ) : (
                  <>
                    <div className="max-h-60 md:max-h-80 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center py-3 border-b border-gray-100">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md mr-3"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{item.name}</h4>
                            <p className="text-purple-600 font-medium">${item.price.toFixed(2)}</p>
                            <div className="flex items-center mt-1">
                              <button
                                onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                className="text-gray-500 hover:text-purple-600 focus:outline-none cursor-pointer"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="mx-2 text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                className="text-gray-500 hover:text-purple-600 focus:outline-none cursor-pointer"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 focus:outline-none ml-2 cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex justify-between mb-3">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">${cartTotal.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsCheckoutOpen(true)
                          setIsCartOpen(false)
                        }}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      {isMenuOpen && (
        <div
          className="lg:hidden shadow-md py-6 px-6 transition-colors duration-300 fixed left-0 right-0 top-[60px] z-40"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <div className="flex flex-col space-y-5">
            <button
              onClick={() => {
                scrollToSection("popular-products")
                setIsMenuOpen(false)
              }}
              className="hover:text-purple-600 transition-colors py-2 text-left border-b border-gray-200 dark:border-gray-700 cursor-pointer"
              style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
            >
              Tech & Gadgets
            </button>
            <button
              onClick={() => {
                scrollToSection("collections")
                setIsMenuOpen(false)
              }}
              className="hover:text-purple-600 transition-colors py-2 text-left border-b border-gray-200 dark:border-gray-700 cursor-pointer"
              style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
            >
              Popular
            </button>
            <button
              onClick={() => {
                scrollToSection("reviews")
                setIsMenuOpen(false)
              }}
              className="hover:text-purple-600 transition-colors py-2 text-left border-b border-gray-200 dark:border-gray-700 cursor-pointer"
              style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
            >
              Testimonials
            </button>
            <button
              onClick={() => {
                scrollToSection("newsletter")
                setIsMenuOpen(false)
              }}
              className="hover:text-purple-600 transition-colors py-2 text-left border-b border-gray-200 dark:border-gray-700 cursor-pointer"
              style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
            >
              Stay Updated
            </button>
            <button
              onClick={() => {
                scrollToSection("footer")
                setIsMenuOpen(false)
              }}
              className="hover:text-purple-600 transition-colors py-2 text-left cursor-pointer"
              style={{ color: isDarkMode ? "#ffffff" : "#374151" }}
            >
              Contact
            </button>
          </div>
        </div>
      )}
      {isSearchOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] px-4 z-40" onClick={(e) => e.stopPropagation()}>
          <div
            className="rounded-lg shadow-lg p-4 transition-colors duration-300"
            style={{ backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }}
          >
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 focus:outline-none"
                  style={{
                    backgroundColor: isDarkMode ? "#2d2d2d" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#000000",
                  }}
                  autoFocus
                />
                <button type="submit" className="bg-purple-500 text-white p-2 hover:bg-purple-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {searchQuery.trim() !== "" && (
                  <>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      {filteredProducts.length === 0
                        ? "No products found"
                        : `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`}
                    </h3>

                    {filteredProducts.map((product) => (
                      <div key={product.id} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md mr-3"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{product.name}</h4>
                          <p className="text-purple-600 text-sm font-medium">${product.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(product)
                            showToast(`${product.name} added to your cart`)
                          }}
                          className="ml-2 bg-purple-500 hover:bg-purple-600 h-8 w-8 rounded-full hidden lg:flex items-center justify-center shadow-sm transition-colors"
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </>
                )}
                {searchQuery.trim() === "" && (
                  <p className="text-sm text-gray-500 text-center py-4">Type to search products</p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      <section id="hero" className="relative mx-4 md:mx-8 lg:mx-16 my-4 rounded-[40px] overflow-hidden">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?q=80&w=2652&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Smart home devices"
            className="w-full h-[500px] md:h-[600px] object-cover rounded-[40px]"
          />
          <div className="absolute inset-0 bg-black/40 rounded-[40px]"></div>

          <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-end justify-between">
            <div className="md:w-1/2 text-white z-10 mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Smart Living Starts
                <br />
                with Innovation
              </h1>
            </div>

            <div className="md:w-1/3 text-white z-10">
              <p className="text-lg mb-6 text-gray-100">
                Discover cutting-edge products crafted to elevate your lifestyle, boost productivity, and simplify
                everyday tasks.
              </p>
              <button
                onClick={() => scrollToSection("popular-products")}
                className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-8 rounded-full transition-colors cursor-pointer"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="popular-products" className="py-16 px-4 md:px-8 lg:px-16">
        <div
          className="rounded-[40px] py-16 px-6 md:px-12 transition-colors duration-300"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Most Popular Products
            <br />
            This Week
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative rounded-[32px] overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="h-80 w-full">
                <img
                  src="https://images.unsplash.com/photo-1627040849263-b94ab1502618?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Premium Smartwatch"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4">
                <div className="bg-black/40 backdrop-blur-lg text-white py-2 px-5 rounded-full border border-white/20 shadow-lg">
                  <h3 className="text-lg font-medium">Premium Smartwatch</h3>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      addToCart({
                        id: 1,
                        name: "Premium Smartwatch",
                        price: 199.99,
                        image:
                          "https://images.unsplash.com/photo-1627040849263-b94ab1502618?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      })
                    }
                    className="bg-purple-500 hover:bg-purple-600 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative rounded-[32px] overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="h-80 w-full">
                <img
                  src="https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Wireless Headphones"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4">
                <div className="bg-black/40 backdrop-blur-lg text-white py-2 px-5 rounded-full border border-white/20 shadow-lg">
                  <h3 className="text-lg font-medium">Wireless Headphones</h3>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      addToCart({
                        id: 2,
                        name: "Wireless Headphones",
                        price: 180.99,
                        image:
                          "https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                      })
                    }
                    className="bg-purple-500 hover:bg-purple-600 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative rounded-[32px] overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="h-80 w-full">
                <img
                  src="https://images.unsplash.com/photo-1596998791568-386ef5297c2e?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Retro Tech"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4">
                <div className="bg-black/40 backdrop-blur-lg text-white py-2 px-5 rounded-full border border-white/20 shadow-lg">
                  <h3 className="text-lg font-medium">Retro Tech</h3>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      addToCart({
                        id: 7,
                        name: "Retro Tech",
                        price: 230.99,
                        image:
                          "https://images.unsplash.com/photo-1596998791568-386ef5297c2e?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      })
                    }
                    className="bg-purple-500 hover:bg-purple-600 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="collections" className="py-16 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Best Selling Collections</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative rounded-[32px] overflow-hidden shadow-lg transition-transform hover:scale-105 lg:row-span-2">
            <div className="h-full w-full">
              <img
                src="https://images.unsplash.com/photo-1620423855978-e5d74a7bef30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGVsZWN0cm9uaWMlMjBnYWRnZXR8ZW58MHwxfDB8fHww"
                alt="D-Link Router"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4">
              <div className="bg-black/40 backdrop-blur-lg text-white py-2 px-5 rounded-full border border-white/20 shadow-lg">
                <h3 className="text-lg font-medium">D-Link Router</h3>
              </div>
              <button
                onClick={() =>
                  addToCart({
                    id: 3,
                    name: "D-Link Router",
                    price: 149.99,
                    image:
                      "https://images.unsplash.com/photo-1620423855978-e5d74a7bef30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGVsZWN0cm9uaWMlMjBnYWRnZXR8ZW58MHwxfDB8fHww",
                  })
                }
                className="bg-purple-500 hover:bg-purple-600 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative rounded-[32px] overflow-hidden shadow-lg transition-transform hover:scale-105 lg:row-span-2">
            <div className="h-full w-full">
              <img
                src="https://images.unsplash.com/photo-1730299788623-12cded84cf40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGFpciUyMGNvb2xlcnxlbnwwfDF8MHx8fDA%3D"
                alt="Portable Air Cooler"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4">
              <div className="bg-black/40 backdrop-blur-lg text-white py-2 px-5 rounded-full border border-white/20 shadow-lg">
                <h3 className="text-lg font-medium">Portable Air Cooler</h3>
              </div>
              <button
                onClick={() =>
                  addToCart({
                    id: 4,
                    name: "Portable Air Cooler",
                    price: 129.99,
                    image:
                      "https://images.unsplash.com/photo-1730299788623-12cded84cf40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGFpciUyMGNvb2xlcnxlbnwwfDF8MHx8fDA%3D",
                  })
                }
                className="bg-purple-500 hover:bg-purple-600 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative rounded-[32px] overflow-hidden shadow-lg transition-transform hover:scale-105">
            <div className="h-full w-full">
              <img
                src="https://images.unsplash.com/photo-1467244757843-7d30a709703e?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Ultra HD Camera"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4">
              <div className="bg-black/40 backdrop-blur-lg text-white py-2 px-5 rounded-full border border-white/20 shadow-lg">
                <h3 className="text-lg font-medium">Ultra HD Camera</h3>
              </div>
              <button
                onClick={() =>
                  addToCart({
                    id: 5,
                    name: "Ultra HD Camera",
                    price: 349.99,
                    image:
                      "https://images.unsplash.com/photo-1467244757843-7d30a709703e?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  })
                }
                className="bg-purple-500 hover:bg-purple-600 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative rounded-[32px] overflow-hidden shadow-lg transition-transform hover:scale-105">
            <div className="h-full w-full">
              <img
                src="https://images.unsplash.com/photo-1696429175928-793a1cdef1d3?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Virtual Reality"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4">
              <div className="bg-black/40 backdrop-blur-lg text-white py-2 px-5 rounded-full border border-white/20 shadow-lg">
                <h3 className="text-lg font-medium">Virtual Reality</h3>
              </div>
              <button
                onClick={() =>
                  addToCart({
                    id: 6,
                    name: "Virtual Reality",
                    price: 299.99,
                    image:
                      "https://images.unsplash.com/photo-1696429175928-793a1cdef1d3?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  })
                }
                className="bg-purple-500 hover:bg-purple-600 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-16">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Real Customer
                <br />
                Reviews
              </h2>

              <div
                className="rounded-[32px] p-8 relative transition-colors duration-300"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <div className="text-gray-400 text-5xl font-serif absolute top-6 left-6">"</div>

                <div
                  className={`mt-10 mb-10 transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-100"}`}
                >
                  <p className="text-lg relative z-10 leading-relaxed" style={{ color: "var(--text-primary)" }}>
                    {reviews[currentReviewIndex].text}
                  </p>
                </div>

                <div className="text-gray-400 text-5xl font-serif absolute bottom-16 right-6">"</div>

                <div className="flex justify-between items-center mt-6">
                  <div className={`transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
                    <h4 className="text-xl font-semibold">{reviews[currentReviewIndex].name}</h4>
                    <p style={{ color: "var(--text-secondary)" }}>{reviews[currentReviewIndex].title}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={showPrevReview}
                      disabled={activeButton === "prev"}
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        activeButton === "prev"
                          ? "bg-purple-500 text-white cursor-not-allowed opacity-80"
                          : isDarkMode
                            ? "bg-gray-700 hover:bg-purple-700 active:bg-purple-800 cursor-pointer"
                            : "bg-gray-100 hover:bg-purple-200 active:bg-purple-300 cursor-pointer"
                      }`}
                      aria-label="Previous review"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke={isDarkMode ? "white" : "currentColor"}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={showNextReview}
                      disabled={activeButton === "next"}
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        activeButton === "next"
                          ? "bg-purple-500 text-white cursor-not-allowed opacity-80"
                          : isDarkMode
                            ? "bg-gray-700 hover:bg-purple-700 active:bg-purple-800 cursor-pointer"
                            : "bg-gray-100 hover:bg-purple-200 active:bg-purple-300 cursor-pointer"
                      }`}
                      aria-label="Next review"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke={isDarkMode ? "white" : "currentColor"}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="rounded-[32px] overflow-hidden shadow-lg bg-gray-200 h-auto">
                <img
                  src={reviews[currentReviewIndex].image || "/placeholder.svg"}
                  alt={`${reviews[currentReviewIndex].name} with Nexoro product`}
                  className={`w-full h-[450px] md:h-[500px] object-cover object-top transition-opacity duration-500 ${
                    isAnimating ? "opacity-0" : "opacity-100"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="newsletter" className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-[32px] py-16 px-6 md:px-12 text-center transition-colors duration-300"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to our emails</h2>
            <p className="max-w-2xl mx-auto mb-8" style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}>
              Sign up now to receive exclusive deals, product updates, and special offers directly via email.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  style={{
                    backgroundColor: isDarkMode ? "#2d2d2d" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    borderColor: isDarkMode ? "#555555" : undefined,
                  }}
                />
              </div>
              <button
                onClick={handleNewsletterSubmit}
                disabled={isSubmitting || !email}
                className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Signing up..." : "Sign up"}
              </button>
            </div>
            <div className="mt-6 h-10">
              {isSubscribed && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg animate-fade-in">
                  Success! You've been added to our mailing list.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer
        id="footer"
        className="pt-16 pb-8 px-4 md:px-8 lg:px-16 transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">Nexoro</span>
              </div>
              <p className="mb-6" style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}>
                Discover cutting-edge products crafted to elevate your lifestyle, boost productivity, and simplify
                everyday tasks.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors"
                  style={{ backgroundColor: "var(--icon-bg)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors"
                  style={{ backgroundColor: "var(--icon-bg)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors"
                  style={{ backgroundColor: "var(--icon-bg)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors"
                  style={{ backgroundColor: "var(--icon-bg)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-youtube"
                  >
                    <path
                      d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2
2 0 0 1 2.5 17"
                    ></path>
                    <path d="m10 15 5-3-5-3z"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="hover:text-purple-600 transition-colors cursor-pointer"
                    style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("popular-products")}
                    className="hover:text-purple-600 transition-colors cursor-pointer"
                    style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}
                  >
                    Popular Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("collections")}
                    className="hover:text-purple-600 transition-colors cursor-pointer"
                    style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}
                  >
                    Collections
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("reviews")}
                    className="hover:text-purple-600 transition-colors cursor-pointer"
                    style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}
                  >
                    Customer Reviews
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("newsletter")}
                    className="hover:text-purple-600 transition-colors cursor-pointer"
                    style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}
                  >
                    Newsletter
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}>
                    123 Tech Street, Innovation City, 10001
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 2 0 002 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}>support@nexoro.com</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="text-center">
              <p className="text-sm" style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}>
                &copy; {new Date().getFullYear()} Nexoro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      {isSideCartOpen && (
        <div className="lg:hidden fixed inset-0 z-[150] overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsSideCartOpen(false)}
          ></div>

          <div
            className="absolute top-0 right-0 h-full w-[85%] max-w-md bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out"
            style={{
              backgroundColor: "var(--card-bg)",
              color: "var(--text-primary)",
              animation: "slideInRight 0.3s forwards",
            }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold">Your Cart</h3>
                <button
                  onClick={() => setIsSideCartOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Close cart"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-300 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <button
                      onClick={() => {
                        setIsSideCartOpen(false)
                        scrollToSection("popular-products")
                      }}
                      className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-full transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start py-4 border-b border-gray-100 dark:border-gray-800"
                      >
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md mr-4"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{item.name}</h4>
                          <p className="text-purple-600 font-medium mb-2">${item.price.toFixed(2)}</p>
                          <div className="flex items-center">
                            <button
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                              className="text-gray-500 hover:text-purple-600 focus:outline-none h-8 w-8 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-l-md"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="h-8 min-w-[2rem] flex items-center justify-center border-t border-b border-gray-200 dark:border-gray-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              className="text-gray-500 hover:text-purple-600 focus:outline-none h-8 w-8 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-r-md"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 focus:outline-none ml-2 p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between mb-6">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-lg font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(true)
                      setIsSideCartOpen(false)
                    }}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg transition-colors text-lg font-medium"
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
          <div
            className="rounded-lg shadow-xl w-full max-w-md overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">{checkoutStep === 1 ? "Checkout" : "Order Confirmed!"}</h3>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false)
                    setCheckoutStep(1)
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {checkoutStep === 1 ? (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Subtotal:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Shipping:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <form onSubmit={handleCheckoutSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="cardNumber"
                          className="block text-sm font-medium mb-1"
                          style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}
                        >
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={cardDetails.cardNumber}
                          onChange={handleCardDetailsChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={`w-full px-3 py-3 border rounded-md ${errors.cardNumber ? "border-red-500" : "border-gray-300"}`}
                          style={{
                            backgroundColor: isDarkMode ? "#2d2d2d" : "#ffffff",
                            color: isDarkMode ? "#ffffff" : "#000000",
                            borderColor: isDarkMode && !errors.cardNumber ? "#555555" : undefined,
                          }}
                        />
                        {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
                      </div>

                      <div>
                        <label
                          htmlFor="cardHolder"
                          className="block text-sm font-medium mb-1"
                          style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}
                        >
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          id="cardHolder"
                          name="cardHolder"
                          value={cardDetails.cardHolder}
                          onChange={handleCardDetailsChange}
                          placeholder="John Doe"
                          className={`w-full px-3 py-3 border rounded-md ${errors.cardHolder ? "border-red-500" : "border-gray-300"}`}
                          style={{
                            backgroundColor: isDarkMode ? "#2d2d2d" : "#ffffff",
                            color: isDarkMode ? "#ffffff" : "#000000",
                            borderColor: isDarkMode && !errors.cardHolder ? "#555555" : undefined,
                          }}
                        />
                        {errors.cardHolder && <p className="mt-1 text-sm text-red-500">{errors.cardHolder}</p>}
                      </div>

                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label
                            htmlFor="expiryDate"
                            className="block text-sm font-medium mb-1"
                            style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}
                          >
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={cardDetails.expiryDate}
                            onChange={handleCardDetailsChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`w-full px-3 py-3 border rounded-md ${errors.expiryDate ? "border-red-500" : "border-gray-300"}`}
                            style={{
                              backgroundColor: isDarkMode ? "#2d2d2d" : "#ffffff",
                              color: isDarkMode ? "#ffffff" : "#000000",
                              borderColor: isDarkMode && !errors.expiryDate ? "#555555" : undefined,
                            }}
                          />
                          {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
                        </div>

                        <div className="w-1/3">
                          <label
                            htmlFor="cvv"
                            className="block text-sm font-medium mb-1"
                            style={{ color: isDarkMode ? "#ffffff" : "#4b5563" }}
                          >
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={handleCardDetailsChange}
                            placeholder="123"
                            maxLength={4}
                            className={`w-full px-3 py-3 border rounded-md ${errors.cvv ? "border-red-500" : "border-gray-300"}`}
                            style={{
                              backgroundColor: isDarkMode ? "#2d2d2d" : "#ffffff",
                              color: isDarkMode ? "#ffffff" : "#000000",
                              borderColor: isDarkMode && !errors.cvv ? "#555555" : undefined,
                            }}
                          />
                          {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessingPayment}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-lg font-medium cursor-pointer"
                      >
                        {isProcessingPayment ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          "Pay Now"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Thank you for your order!</h4>
                  <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
                  <p className="text-sm text-gray-500">You will receive an email confirmation shortly.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {toast.visible && (
        <div className="fixed bottom-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in z-50">
          {toast.message}
        </div>
      )}
      <style jsx>{`
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Custom Scrollbar Styles */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background-color: ${isDarkMode ? "#1e1e1e" : "#f1f1f1"};
}

::-webkit-scrollbar-thumb {
  background-color: ${isDarkMode ? "#4b4b4b" : "#c1c1c1"};
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: ${isDarkMode ? "#555555" : "#a1a1a1"};
}

/* For Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: ${isDarkMode ? "#4b4b4b #1e1e1e" : "#c1c1c1 #f1f1f1"};
}

/* Add slide-in animation for side cart */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
`}</style>
    </div>
  )
}


