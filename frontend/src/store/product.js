import { create } from 'zustand';

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields" };
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      // Check if the response is OK (status 200-299) and ensure content-type is JSON
      if (!res.ok) {
        const errorData = await res.json(); // Attempt to parse error message
        return { success: false, message: errorData.message || "Failed to create product" };
      }

      // Only try to parse JSON if the response has content
      const data = await res.json();

      // Assuming data.data contains the newly created product
      set((state) => ({ products: [...state.products, data.message] }));

      return { success: true, message: "Product created successfully" };
    } catch (error) {
      return { success: false, message: "An error occurred: " + error.message };
    }
  },

  fetchProducts: async() =>{
    const res = await fetch("/api/products");
    const  data= await res.json();
    set({products:data.data})
  },

  deleteProduct: async (pid) => {
    const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
    return { success: true, message: data.message };
},
updateProduct: async (pid, updatedProduct) => {
    const res = await fetch(`/api/products/${pid}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the ui immediately, without needing a refresh
    set((state) => ({
        products: state.products.map((product) => (product._id === pid ? data.data : product)),
    }));

    return { success: true, message: data.message };
},

}));
