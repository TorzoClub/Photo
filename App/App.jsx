import React from 'react'
import './App.scss'

import Api from './Api'

import Gallery from './Components/Gallery'

const App = () => {
  const list = Api.getData()

  const GalleryList = list.map(yearGallery => (
    <Gallery
      year={ yearGallery.year }
      gallery={ yearGallery.gallery }
      key={ yearGallery.year.toString() }
    />
  ))

  return (
    <div>
      { GalleryList }
    </div>
  )
}

export default App
