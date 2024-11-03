import streamlit as st
import requests
import pandas as pd

api_url = 'http://localhost:3000/scrape'

st.title('Auction Parser')

try:
    response = requests.get(api_url)
    st.write("Response status:", response.status_code)

    if response.status_code == 200:
        data = response.json()
        # st.write("Response from backend:", data["data"])
        
        df = pd.DataFrame(data["data"])
        
        st.dataframe(df)
        
        if 'price' in df.columns:
            st.bar_chart(df['price'])
        
    else:
        st.write("Failed to fetch data from backend.")
except requests.exceptions.RequestException as e:
    st.write("Error connecting to backend:", e)
