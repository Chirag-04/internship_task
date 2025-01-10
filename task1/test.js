async function fetchApi(){
    const response =  await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&x_cg_demo_api_key=CG-U5zjZS1ptkbw2BPJ3Sq2PCET")
    const data = await response.text()
    console.log(data);
}

fetchApi();

