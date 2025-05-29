$(function() {
  $("#search-btn").on('click', async function() {
    console.log("hello");
    await axios.get('/api/restaurant?lon=-74.05546427741899&lat=4.692597149999999');
  })

  $("#search-btn-city").on('click', async function() {
    let val = $("#city").val();
    await axios.get('/api/restaurant?city=' + val);
  })

  $("#search-btn-txs").on('click', async function() {
    console.log(11111);
    let type = $("#tx-type").val();
    await axios.get('/api/transaction?type=' + type);
  })
}); 
