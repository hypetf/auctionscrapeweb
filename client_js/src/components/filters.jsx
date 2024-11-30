export default function Filters({ filters, onFilterChange }) {
    const handleInputChange = (e) => {
      const { name, value } = e.target
      onFilterChange({
        ...filters,
        [name]: value
      })
    }
  
    return (
      <div className="filters">
        <h3 className="filters-title">Filters</h3>
        
        <div className="filter-group">
          <label>Postcode</label>
          <input
            type="text"
            name="postcode"
            value={filters.postcode}
            onChange={handleInputChange}
            placeholder="Enter postcode"
            className="filter-input"
          />
        </div>
  
        <div className="filter-group">
          <label>Energy Rating</label>
          <select
            name="energyRating"
            value={filters.energyRating}
            onChange={handleInputChange}
            className="filter-select"
          >
            <option value="">Select energy rating</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
        </div>
  
        <div className="filter-group">
          <label>Price Range: £{filters.priceRange.toLocaleString()}</label>
          <input
            type="range"
            name="priceRange"
            min="0"
            max="1000000"
            step="1000"
            value={filters.priceRange}
            onChange={handleInputChange}
            className="price-slider"
          />
          <div className="price-range-labels">
            <span>£0</span>
            <span>£1,000,000</span>
          </div>
        </div>
  
        <button className="apply-filters-btn">
          Apply Filters
        </button>
      </div>
    )
  }
  
  