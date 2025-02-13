import React, { useState, useEffect } from 'react';

function ShopCat() {
  const [categories, setCategories] = useState([]);

  const apiUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetch(`${apiUrl}/catgory-api/displaycategory`,{
      headers: {
          "x-api-key": process.env.REACT_APP_API_KEY, // Use environment variable
      },
  })
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories', error));
  }, [apiUrl]);

  const handleCategoryClick = (categoryId) => {
    sessionStorage.setItem('selectedCategory', categoryId);  
    window.location.href='/filterproduct';
  };

  return (
    <div className="col-lg-3">
        <div className="shop__sidebar__accordion">
          <div className="accordion" id="accordionExample">
            <div className="card">
              <div className="card-heading">
                <p data-toggle="collapse" data-target="#collapseOne">
                  Categories
                </p>
              </div>
              <div
                id="collapseOne"
                className="collapse show"
                data-parent="#accordionExample"
              >
                <div className="card-body">
                  <div className="shop__sidebar__categories">
                    <ul className="nice-scroll">
                      
                      {categories.map((category) => (
                        <li key={category._id}>
                          <p 
                            className="catgorylist"
                            onClick={() => handleCategoryClick(category._id)}
                          >
                            {category.name}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-heading">
                <p data-toggle="collapse" data-target="#collapseTwo">
                  Size
                </p>
              </div>
              <div
                id="collapseTwo"
                className="collapse show"
                data-parent="#accordionExample"
              >
                <div className="card-body">
                  <div>
                    <ul className="nice-scroll">
                      <li>
                        {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                          <p
                            key={size}
                            className="catgorylist"
                            onClick={() => {
                              sessionStorage.setItem("ProductShowSize", size);
                              window.location.href="/filtersize";
                            }}
                          >
                            {size}
                          </p>
                        ))}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
}

export default ShopCat;
