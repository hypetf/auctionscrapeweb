import streamlit as st
import pandas as pd
import requests

api_url = 'http://localhost:3000/scrape'

st.title("Auction Parser")
st.sidebar.header("Filters")

location = st.sidebar.selectbox("Location", ["All", "Manchester", "London", "Birmingham"])
price_range = st.sidebar.slider("Price Range (£)", 0, 1000000, (0, 1000000))
property_type = st.sidebar.multiselect("Property Type", ["Online", "Residential", "Commercial"])
bedrooms = st.sidebar.selectbox("Bedrooms", ["Any", "1", "2", "3", "4", "5+"])
auction_end_date = st.sidebar.date_input("Auction End Date")

search_query = st.text_input("Search auctions...")

data = []

try:
    response = requests.get(api_url)
    
    if response.status_code == 200:
        data = response.json()["data"]
    else:
        st.write("Failed to fetch data from backend.")
except Exception as e:
    st.write("Error connecting to backend:", e)

df = pd.DataFrame(data)

if location != "All":
    df = df[df['address'].str.contains(location)]

df = df[(df['cleanedPrice'].fillna(0) >= price_range[0]) & (df['cleanedPrice'].fillna(0) <= price_range[1])]

if property_type:
    df = df[df['propertyType'].isin(property_type)]

if search_query:
    df = df[df['title'].str.contains(search_query)]

st.subheader(f"Auctions ({len(df)})")
cols = st.columns(3)

for index, row in df.iterrows():
    with cols[index % 3]:
        st.image(row["imageSrc"], width=220)
        st.markdown(f"### [{row['title']}]({row['auctionLink']})")
        st.markdown(f"📍 **Location:** {row['address']}")
        st.markdown(f"💼 **Type:** {row['propertyType']}")
        st.markdown(f"💰 **Starting Bid:** £{row['cleanedPrice']:,}")
        st.markdown("---")
