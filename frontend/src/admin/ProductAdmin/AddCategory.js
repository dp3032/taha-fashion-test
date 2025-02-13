import React, { useEffect, useState } from "react";
import LeftSide from "../AdminComponent/LeftSide";
import "../adminstyle.css";
import NotifactionAdmin from "../AdminComponent/NotifactionAdmin";

function AddCategory() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);  // For storing category id to edit
  const apiUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetch(`${apiUrl}/catgory-api/displaycategory`,{
      headers: {
          "x-api-key": process.env.REACT_APP_API_KEY, // Use environment variable
      },
  })
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories", error));
  }, [apiUrl]);

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/catgory-api/addcategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (response.ok) {
        alert("Category added successfully!");
        window.location.reload();
        setNewCategory("");
      } else {
        alert("Category already exists please pry other name...!");
      }
    } catch (err) {
      alert("Category was not added. Please try again!");
      console.error("Error adding category:", err);
    }
  };

  const editCategory = (categoryId, categoryName) => {
    setEditCategoryId(categoryId);
    setNewCategory(categoryName);

    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateCategory = async (e) => {
    e.preventDefault();
    if (!editCategoryId) return;

    try {
      const response = await fetch(`${apiUrl}/catgory-api/editcategory/${editCategoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (response.ok) {
        alert("Category updated successfully!");
        window.location.reload();
      } else {
        alert("Error updating category!");
      }
    } catch (err) {
      alert("Category update failed. Please try again!");
      console.error("Error updating category:", err);
    }
  };

  const deleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category and all releted products?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${apiUrl}/catgory-api/deletecategory/${categoryId}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          alert("Category and associated products deleted successfully!");
          window.location.reload();
        } else {
          alert("Error deleting category!");
        }
      } catch (err) {
        alert("Category deletion failed. Please try again!");
        console.error("Error deleting category:", err);
      }
    }
  };
  

  return (
    <>
      <LeftSide />
      <div className="bord">
        <section className="breadcrumb-option">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb__text">
                  <h4>Product </h4>
                  <div className="breadcrumb__links">
                    <a href="/dashboard"> Dashboard </a>
                    <a href="/product"> Product Display </a>
                    <a href="/addcategory"> Category </a>
                  </div>
                </div>
              </div>
              <NotifactionAdmin/>
            </div>
          </div>
        </section>
        {/* Existing code for breadcrumbs and form */}
        <div className="form-container mt-4">
          <h1 className="form-title"> {editCategoryId ? "Edit Category" : "Add Category"} </h1> 
          <form className="product-form" onSubmit={editCategoryId ? updateCategory : addCategory}>
            <div className="form-field">
              <label htmlFor="category-name" className="form-label">Category Name</label>
              <input
                type="text"
                id="category-name"
                className="form-input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>
            
            <button type="submit" className="submit-btnn">
              {editCategoryId ? "Update Category" : "Add Category"}
            </button>
          </form>
        </div>

        {/* Categories Table */}
        <div className="col-lg-12">
          <p className="anyview">Categories</p>
          <p className="mt-2"> Note : Delete Category Also Delete All Product Of Releted Category </p>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Category Name</th>
                  <th scope="col">Time</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>{category.add_date}</td>
                    <td>
                      <button onClick={() => editCategory(category._id, category.name)} className="btnicon">
                        <lord-icon
                          src="https://cdn.lordicon.com/fikcyfpp.json"
                          trigger="hover">
                        </lord-icon>
                      </button>

                      <button onClick={() => deleteCategory(category._id)} className="btnicon">
                        <lord-icon
                            src="https://cdn.lordicon.com/hwjcdycb.json"
                            trigger="morph"
                            state="morph-trash-in">
                        </lord-icon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(AddCategory);
