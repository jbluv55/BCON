import axios from 'axios';
import * as cheerio from 'cheerio';

axios.get('https://uniquecollegeofnursing.edu.ng/')
  .then(res => {
    const $ = cheerio.load(res.data);
    
    // Find text containing vision or mission
    $('div, p, h1, h2, h3, h4, section').each((i, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      if ((text.toLowerCase().includes('vision') || text.toLowerCase().includes('mission')) && text.length < 1500 && text.length > 50) {
        console.log(`--- Element ${i} ---`);
        console.log(text);
      }
    });
  })
  .catch(err => {
    console.error('Error fetching text:', err.message);
  });
