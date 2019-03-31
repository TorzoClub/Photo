import React from 'react'
import { HashRouter as Router, NavLink } from "react-router-dom"
import { AnimatedRoute } from 'react-router-transition';

import './App.scss'

import Api from './Api'

import Gallery from './Components/Gallery'

import Detail from './Pages/Detail'

const App = props => {
  const list = Api.getData()

  const handleToDetail = data => {
    console.warn(data)
    data.photo.imageDataUrl = URL.createObjectURL(data.imageData)
    location.hash = `#/${data.year}/${data.id}/detail`
    // const blobUrl = URL.createObjectURL(hhh)
  }

  const GalleryList = (
    <div className="gallery-list">
      {
        list.map(yearGallery => (
          <Gallery
            toDetail={ handleToDetail }
            year={ yearGallery.year }
            gallery={ yearGallery.gallery }
            key={ yearGallery.year.toString() }
          />
        ))
      }
    </div>
  )

  return (
    <Router>
      <div>
        { GalleryList }

        <AnimatedRoute
          path={'/:year/:id/detail'}
          component={ Detail }
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
        />
      </div>
    </Router>
  )
}


export default App
