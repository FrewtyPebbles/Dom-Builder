import "#events/inputs"
import "#events/builder"

// This file is imported on the HTML page

// Register the service worker
if("serviceWorker" in navigator){
    navigator.serviceWorker.register("src/service_worker.js").then(registration=>{
      console.log("SW Registered!");
    }).catch(error=>{
      console.log("SW Registration Failed");
    });
}else{
  console.log("Not supported");
}
