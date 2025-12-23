import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6"
import { useSelector } from 'react-redux'
import FoodCard from './FoodCard'
import { useNavigate } from 'react-router-dom'

function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } =
    useSelector(state => state.user)

  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const navigate = useNavigate()

  const [showLeftCateButton, setShowLeftCateButton] = useState(false)
  const [showRightCateButton, setShowRightCateButton] = useState(false)
  const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(false)
  const [updatedItemsList, setUpdatedItemsList] = useState([])

  const handleFilterByCategory = (category) => {
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity)
    } else {
      setUpdatedItemsList(itemsInMyCity?.filter(i => i.category === category))
    }
  }

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  }, [itemsInMyCity])

  const updateButton = (ref, setLeft, setRight) => {
    const el = ref.current
    if (el) {
      setLeft(el.scrollLeft > 0)
      setRight(el.scrollLeft + el.clientWidth < el.scrollWidth)
    }
  }

  const scrollHandler = (ref, dir) => {
    ref.current?.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth"
    })
  }

  useEffect(() => {
    updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
    updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
  }, [categories])

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Nav />

      {searchItems?.length > 0 && (
        <div className='w-full max-w-6xl flex flex-col gap-5 p-5 bg-white shadow-md rounded-2xl mt-4'>
          <h1 className='text-2xl font-semibold'>Search Results</h1>
          <div className='flex flex-wrap gap-6 justify-center'>
            {searchItems.map(item => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        </div>
      )}

      <div className='w-full max-w-6xl flex flex-col gap-5 p-3'>
        <h1 className='text-2xl'>Inspiration for your first order</h1>

        <div className='relative'>
          {showLeftCateButton && (
            <button
              onClick={() => scrollHandler(cateScrollRef, "left")}
              className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full z-10'
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div ref={cateScrollRef} className='flex overflow-x-auto gap-4'>
            {categories.map((c, i) => (
              <CategoryCard
                key={i}
                name={c.category}
                image={c.image}
                onClick={() => handleFilterByCategory(c.category)}
              />
            ))}
          </div>

          {showRightCateButton && (
            <button
              onClick={() => scrollHandler(cateScrollRef, "right")}
              className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full z-10'
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      <div className='w-full max-w-6xl flex flex-col gap-5 p-3'>
        <h1 className='text-2xl'>Best Shop in {currentCity}</h1>

        <div className='relative'>
          {showLeftShopButton && (
            <button
              onClick={() => scrollHandler(shopScrollRef, "left")}
              className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full z-10'
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div ref={shopScrollRef} className='flex overflow-x-auto gap-4'>
            {shopInMyCity?.map(shop => (
              <CategoryCard
                key={shop._id}
                name={shop.name}
                image={shop.image}
                onClick={() => navigate(`/shop/${shop._id}`)}
              />
            ))}
          </div>

          {showRightShopButton && (
            <button
              onClick={() => scrollHandler(shopScrollRef, "right")}
              className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full z-10'
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      <div className='w-full max-w-6xl flex flex-col gap-5 p-3'>
        <h1 className='text-2xl'>Suggested Food Items</h1>
        <div className='flex flex-wrap gap-5 justify-center'>
          {updatedItemsList?.map((item, i) => (
            <FoodCard key={i} data={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
