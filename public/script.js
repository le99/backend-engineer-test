$(function() {
  $("#search-btn").on('click', async function() {
    console.log("hello");
    await axios.get('/api/restaurants');
  })
}); 
