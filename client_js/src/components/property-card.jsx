export default function PropertyCard({ property }) {
    return (
      <article className="property-card">
        <div className="property-image">
          <img src={property.imageSrc} alt={property.title} />
        </div>
        
        <div className="property-details">
          <h3 className="property-title">{property.title}</h3>
          
          <div className="property-location">
            <span className="location-icon">📍</span>
            {property.address}
          </div>
          
          <div className="property-info">            
            <div className="property-price">
              <span className="price-amount">£ {property.price}</span>
            </div>

            <div className="property-type">
              <span className="info-label">Property Type:</span>
              {property.propertyType}
            </div>
            
            <div className="property-ratings">
              <div className="rating">
                <span className="info-label">Current Energy Rating:</span>
                <b>{property.EPC_Data["current-energy-rating"] ? property.EPC_Data["current-energy-rating"] : "NA"}</b>
              </div>
              <div className="rating">
                <span className="info-label">Potential Energy Rating:</span>
                <b>{property.EPC_Data["potential-energy-rating"] ? property.EPC_Data["potential-energy-rating"] : "NA"}</b>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }
  
  