/**
 






* @name get title
 *
 * @desc Get the title of a page and print it to the console.
 *
 * @see {@link https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagetitle}
 */
 const puppeteer = require('puppeteer');

 var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let scrollTimer;
var flag= true;
var browser, page, browser2, page2;
scrollTimer = null;
(async () => {
  while(flag){
    try{
    browser = await puppeteer.launch({
      devtools: false,
      defaultViewport: {
        width: 1280,
        height: 1024,
      },
      headless: false,
    });
    page = await browser.newPage()
    browser2 = await puppeteer.launch({
      devtools: false,
      defaultViewport: {
        width: 1280,
        height: 1024,
      },
      headless: false,
    });
    page2 = await browser2.newPage()
    flag=false;
    }catch(e){
      console.log("err, trying again")
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
})()



app.post('/start', async function(req, res){
  flag=true
  
  while(flag){
    (async () => {
      try{
          // const browser = await puppeteer.launch()
          
          // await page.goto('https://ie.linkedin.com/jobs/search?keywords=React&location=United%20States&locationId=&geoId=103644278&f_TPR=r604800&f_WT=2&position=1&pageNum=0', {
          await page.goto('https://ie.linkedin.com/jobs/' + req.body.url, {
              waitUntil: "domcontentloaded"
          });
          const title = await page.title()
          console.log(title)
          flag=false
          res.json({success: true})
          console.log('start success')
          console.log(scrollTimer)
          await autoScroll(page);
          return;
          
      }catch(e){
          console.log(e)
      }
     
   })();
   await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
});

app.post('/detail', async function(req, res){
  flag=true
  
  while(flag){
    (async () => {
      try{
          // const browser = await puppeteer.launch()
          
          // await page.goto('https://ie.linkedin.com/jobs/search?keywords=React&location=United%20States&locationId=&geoId=103644278&f_TPR=r604800&f_WT=2&position=1&pageNum=0', {
          await page2.goto('https://ie.linkedin.com/jobs/' + req.body.url, {
              waitUntil: "domcontentloaded"
          });
          const title = await page.title()
          console.log(title)
          flag=false
          res.json({success: true, data: await page.content()})
          console.log('start success')
          return;
          
      }catch(e){
          console.log(e)
      }
     
   })();
   await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
});

app.get('/get', async function(req, res){
  try {
    await page.$eval(".infinite-scroller__show-more-button", elem => elem.click());
    var content = await page.content()
    res.send( {
      success: true,
      len: content.length.toString(),
      data: content,
    } );
    
  } catch (error) {
    res.json({
      success: false
    })
  }
});

app.listen(80);
console.log('server is running')
 


 async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve) => {
          var totalHeight = 0;
          var distance = 100;
          // if(scrollTimer){
          //   console.log('ss=', scrollTimer)
          //   clearInterval(scrollTimer);
          // } 
            
          scrollTimer = setInterval(async () => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
             
              if(totalHeight >= scrollHeight - window.innerHeight){
                  console.log(await page.$$('.infinite-scroller__show-more-button'))
                  await page.click(await page.$$('.infinite-scroller__show-more-button'))
              }
          }, 100);
      });
  });
}