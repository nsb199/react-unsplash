import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ImageGallery.css';

const ACCESS_KEY = 'PYakk4JtfabE_9N12RG34s5Ugxx6Qox2s1XDh1cnXYc';
const PER_PAGE = 10;

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.unsplash.com/photos', {
          params: { page, per_page: PER_PAGE, client_id: ACCESS_KEY, query: searchQuery },
        });
        setImages((prevImages) => [...prevImages, ...response.data]);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [page, searchQuery]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
      loading
    ) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset page to 1 when search query changes
    setImages([]); // Clear images array when search query changes
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Images"
        className="search-bar"
        value={searchQuery}
        onChange={handleSearchChange}
      />
     <div className="image-gallery">
  {images.map((image) => (
    <div key={image.id} className="image-container">
      <img
        src={image.urls.thumb}
        alt={image.alt_description}
        onClick={() => handleImageClick(image)}
      />
      <div className="image-info">
        <p className="image-name">{image.alt_description}</p>
        <p className="photographer">By: {image.user.name}</p>
      </div>
    </div>
  ))}
</div>

      {loading && <p>Loading...</p>}
      {selectedImage && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.urls.full} alt={selectedImage.alt_description} />
            <p>Name: {selectedImage.alt_description}</p>
            <p>Resolution: {selectedImage.width}x{selectedImage.height}</p>
            <a href={selectedImage.links.download} download>Download</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
