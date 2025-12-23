import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { FaUtensils, FaPen } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import OwnerItemCard from './OwnerItemCard'

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center'>
      <Nav />

      {!myShopData && (
        <div className='flex justify-center items-center p-4 sm:p-6'>
          <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100'>
            <div className='flex flex-col items-center text-center'>
              <FaUtensils className='text-[#ff4d2d] w-16 h-16 mb-4' />
              <h2 className='text-xl font-bold mb-2'>Add Your Restaurant</h2>
              <p className='text-gray-600 mb-4'>
                Join our food delivery platform and reach customers.
              </p>
              <button
                className='bg-[#ff4d2d] text-white px-6 py-2 rounded-full'
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className='w-full flex flex-col items-center gap-6 px-4'>
          <h1 className='text-2xl flex items-center gap-3 mt-8'>
            <FaUtensils className='text-[#ff4d2d]' />
            Welcome to {myShopData.name}
          </h1>

          <div className='bg-white shadow-lg rounded-xl w-full max-w-3xl relative'>
            <div
              className='absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-full cursor-pointer'
              onClick={() => navigate("/create-edit-shop")}
            >
              <FaPen size={18} />
            </div>

            <img
              src={myShopData.image}
              alt={myShopData.name}
              className='w-full h-60 object-cover'
            />

            <div className='p-4'>
              <h2 className='text-xl font-bold'>{myShopData.name}</h2>
              <p className='text-gray-500'>
                {myShopData.city}, {myShopData.state}
              </p>
              <p className='text-gray-500'>{myShopData.address}</p>
            </div>
          </div>

          {myShopData.items.length === 0 && (
            <button
              className='bg-[#ff4d2d] text-white px-6 py-2 rounded-full'
              onClick={() => navigate("/add-item")}
            >
              Add Food
            </button>
          )}

          {myShopData.items.length > 0 && (
            <div className='flex flex-col gap-4 w-full max-w-3xl'>
              {myShopData.items.map((item, index) => (
                <OwnerItemCard key={index} data={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OwnerDashboard
