'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';

const FilterSearch = () => {
    const router = useRouter();
    const apiUrlProduct = process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL;
  const [selectedCategory, setSelectedCategory] = useState(null);

    const [maxPrice, setMaxPrice] = useState<number>();
    const [minPrice, setMinPrice] = useState<number>();
    const [pincode, setPincode] = useState<string>(''); 
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [categories, setCategories] = useState([
      { label: "All", value: null },
    ]);
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await axios.get(`${apiUrlProduct}/categories`);
          const data = response.data;
          const formattedCategories = data.map((category) => ({
            label: category.categoryName,
            value: category.categoryId,
          }));
          setCategories([
              { label: "All", value: null },
             
            ...formattedCategories,
          ]);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchCategories();
    }, []);

 const handleSearch = () => {
   const queryParams = new URLSearchParams({
     categoryId: selectedCategory || "",
     maxPrice: maxPrice?.toString() || "",
     minPrice: minPrice?.toString() || "",
     pincode: pincode || "",
     searchText: searchTerm || "",
   }).toString();
   router.push(`/customer/products?${queryParams}`);
 };


  return (
    <div className="grid  p-2 w-100">
      <div className="col-12  p-inputgroup">
        <Dropdown
          value={selectedCategory}
          options={categories}
          onChange={(e) => setSelectedCategory(e.value)}
          placeholder="Select a Category"
                  className="mr-2"
                  optionValue='value'
                  optionLabel='label'
                  
        />
        <AutoComplete
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
        <Button icon="pi pi-search" onClick={handleSearch} />
      </div>
      <div className="col-12 md-6 p-inputgroup">
        <InputText
          value={pincode}
          maxLength={6}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Pincode"
          className="mr-2"
        />
        <InputNumber
          value={minPrice}
          onValueChange={(e) => setMinPrice(e.value)}
          placeholder="Min Price"
          className="mr-2"
        />
        <InputNumber
          value={maxPrice}
          onValueChange={(e) => setMaxPrice(e.value)}
          placeholder="Max Price"
          className="mr-2"
        />
      </div>
    </div>
  );
}

export default FilterSearch