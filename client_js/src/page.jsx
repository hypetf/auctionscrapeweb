'use client'

import { useEffect, useState } from 'react'
import PropertyCard from './components/property-card'
import Filters from './components/filters'
import './styles.css'

export default function PropertyAuctions() {
    const [filters, setFilters] = useState({
        postcode: '',
        energyRating: '',
        windowEfficiency: '',
        priceRange: 1000000
    })
    const [propertiesData, setPropertiesData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:3001/scrape?target=auctionhouse');
                const result = await response.json();
                console.log(result);
                setPropertiesData(result.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    
        fetchData();
    }, []);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters)
    }

    return (
        <div className="app-container">
        <header className="header">
            <div className="logo">AIDATALYTICS</div>
            <div className="search-container">
            <input type="search" placeholder="Search auctions..." className="search-input" />
            </div>
        </header>
        
        <main className="main-content">
            <aside className="filters-sidebar">
                <Filters filters={filters} onFilterChange={handleFilterChange} />
            </aside>
            
            <section className="properties-grid">
            <h2 className="section-title">Featured Auctions</h2>
            <div className="properties-container">
                {
                    propertiesData.length < 1 ?
                    <h3>Loading...</h3>
                    :
                    propertiesData.map(property => (
                        <PropertyCard key={property.auctionLink} property={property} />
                    ))
                }
            </div>
            </section>
        </main>
        </div>
    )
}

