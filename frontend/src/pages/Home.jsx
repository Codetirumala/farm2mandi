import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Grid, Card, CardContent, Divider, Avatar } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MapIcon from '@mui/icons-material/Map';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import Rating from '@mui/material/Rating';
// Using existing icons to avoid potential resolution issues with some icon names
// (if you prefer these specific icons, ensure @mui/icons-material is installed and Vite restarted)


export default function Home(){
  const phrases = ['price signals', 'market demand', 'distance & transport', 'estimated net profit'];
  const [display, setDisplay] = useState('price signals');
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => {
      idx = (idx + 1) % phrases.length;
      setDisplay(phrases[idx]);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
    
      {/* Hero with video loop in a small card and animated subtitle */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs:6, md:12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, lineHeight:1.05 }}>
                Farm2Mandi
                <Typography component="span" color="primary.main" sx={{ display:'block', fontSize:20, mt:1, fontWeight:600 }}>
                  AI-driven mandi recommendations & transport
                </Typography>
              </Typography>

              <Typography variant="h6" color="text.secondary" paragraph sx={{ minHeight:56 }}>
                Predict {""}
                <Box component="span" sx={{ color:'primary.main', fontWeight:700 }}>{display}</Box>
                {" "}- and get mandi suggestions with transport and profit estimates.
              </Typography>

              <Box sx={{ mt:3, display:'flex', gap:2 }}>
                <Button href="/input" variant="contained" size="large">Get Recommendation</Button>
                <Button href="/about" variant="outlined" size="large">Learn more</Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card sx={{ p:0, overflow:'hidden', boxShadow:3 }}>
                <Box sx={{ position:'relative' }}>
                  {!videoError ? (
                    <video
                      src={'/hero.mp4'}
                      poster={'/hero-banner.avif'}
                      autoPlay
                      muted
                      loop
                      playsInline
                      onError={() => setVideoError(true)}
                      style={{ width: '100%', height: 220, objectFit: 'cover', display:'block' }}
                    />
                  ) : (
                    // Unsplash random farm image as fallback
                    <img
                      src={`https://source.unsplash.com/1200x800/?farm,field,agriculture`}
                      alt="Farm scene"
                      style={{ width: '100%', height: 220, objectFit: 'cover', display:'block' }}
                    />
                  )}
                  <Box sx={{ position:'absolute', bottom:12, left:12, bgcolor:'rgba(0,0,0,0.5)', color:'#fff', px:2, py:1, borderRadius:1 }}>
                    <Typography variant="subtitle1">Live market snapshots</Typography>
                    <Typography variant="caption">Quick glance at mandi activity</Typography>
                  </Box>
                </Box>
                <CardContent>
                  <Typography variant="h6">Quick Summary</Typography>
                  <Typography variant="body2" color="text.secondary">Price prediction using LSTM. Mandi ranking with XGBoost. Transport options and tracking.</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

     

      {/* About / Vision - improved layout */}
      <Box sx={{ py:8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight:700 }}>Our mission</Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Empower small and marginal farmers with actionable market intelligence so they can sell at the right time, in the right place, and with minimal logistics cost.
              </Typography>

              <Grid container spacing={2} sx={{ mt:2 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display:'flex', gap:2, alignItems:'flex-start' }}>
                    <MonetizationOnIcon color="primary" sx={{ fontSize:36 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight:600 }}>Sustainable choices</Typography>
                      <Typography variant="body2" color="text.secondary">Promote efficient logistics and reduce waste.</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display:'flex', gap:2, alignItems:'flex-start' }}>
                    <MapIcon color="primary" sx={{ fontSize:36 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight:600 }}>Data-driven</Typography>
                      <Typography variant="body2" color="text.secondary">Price forecasting and ranking powered by proven ML models.</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display:'flex', gap:2, alignItems:'flex-start' }}>
                    <LocalShippingIcon color="primary" sx={{ fontSize:36 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight:600 }}>Transparent timelines</Typography>
                      <Typography variant="body2" color="text.secondary">See arrival trends, seasonality and demand signals.</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display:'flex', gap:2, alignItems:'flex-start' }}>
                    <SupportAgentIcon color="primary" sx={{ fontSize:36 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight:600 }}>Community-first</Typography>
                      <Typography variant="body2" color="text.secondary">Designed for farmer cooperatives and aggregators.</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display:'flex', gap:2, mt:4 }}>
                <Button href="/input" variant="contained">Start now</Button>
                <Button href="/about" variant="outlined">Read whitepaper</Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ borderRadius:2, overflow:'hidden', boxShadow:3 }}>
                <img src={'/about.jpg'} alt="Agriculture" style={{ width:'100%', height: 360, objectFit:'cover', display:'block' }} />
              </Box>

              <Grid container spacing={2} sx={{ mt:2 }}>
                <Grid item xs={4}>
                  <Card sx={{ textAlign:'center', p:2 }}>
                    <Typography variant="h6" sx={{ fontWeight:700 }}>+120%</Typography>
                    <Typography variant="caption" color="text.secondary">Avg. price improvement</Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ textAlign:'center', p:2 }}>
                    <Typography variant="h6" sx={{ fontWeight:700 }}>500+</Typography>
                    <Typography variant="caption" color="text.secondary">Mandis indexed</Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ textAlign:'center', p:2 }}>
                    <Typography variant="h6" sx={{ fontWeight:700 }}>24/7</Typography>
                    <Typography variant="caption" color="text.secondary">Transport options</Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ bgcolor:'grey.50', py:8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ textAlign:'center', fontWeight:600 }}>Core features</Typography>
          <Grid container spacing={3} sx={{ mt:2 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Avatar sx={{ bgcolor:'primary.main', mb:2 }}><MapIcon /></Avatar>
                  <Typography variant="h6">Mandi Ranking</Typography>
                  <Typography variant="body2" color="text.secondary">Rank mandis by predicted price, distance and net profit.</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Avatar sx={{ bgcolor:'primary.main', mb:2 }}><LocalShippingIcon /></Avatar>
                  <Typography variant="h6">Logistics</Typography>
                  <Typography variant="body2" color="text.secondary">Integrated transport recommendations and partial truck aggregation.</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Avatar sx={{ bgcolor:'primary.main', mb:2 }}><SupportAgentIcon /></Avatar>
                  <Typography variant="h6">Support</Typography>
                  <Typography variant="body2" color="text.secondary">Guides and support to help farmers use the platform effectively.</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How it works - Roadmap */}
      <Box sx={{ py:8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight:700, mb:4, textAlign:'center' }}>How it works — Roadmap</Typography>

          {/* Responsive roadmap: horizontal on md+, vertical on xs */}
          <Box sx={{ display:'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs:4, md:2 } }}>
            {/** Step 1 */}
            <Box sx={{ flex:1, textAlign:{ xs:'left', md:'center' } }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:2, justifyContent:{ md:'center' } }}>
                <Box sx={{ bgcolor:'primary.main', color:'#fff', width:64, height:64, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:2 }}>
                  <HourglassBottomIcon sx={{ fontSize:32 }} />
                </Box>
                <Box sx={{ display:{ xs:'block', md:'none' } }}>
                  <Typography variant="h6">Step 1</Typography>
                  <Typography variant="body2" color="text.secondary">Enter details</Typography>
                </Box>
              </Box>
              <Box sx={{ mt:2, display:{ xs:'none', md:'block' } }}>
                <Typography variant="h6">1. Enter your details</Typography>
                <Typography variant="body2" color="text.secondary">Provide crop, quantity and your location so we can assess markets.</Typography>
              </Box>
            </Box>

            {/* connector */}
            <Box sx={{ display:{ xs:'none', md:'flex' }, alignItems:'center', width:80, justifyContent:'center' }}>
              <Box sx={{ height:4, bgcolor:'grey.300', width:'80%' }} />
            </Box>

            {/** Step 2 */}
            <Box sx={{ flex:1, textAlign:{ xs:'left', md:'center' } }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:2, justifyContent:{ md:'center' } }}>
                <Box sx={{ bgcolor:'secondary.main', color:'#fff', width:64, height:64, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:2 }}>
                  <TrendingUpIcon sx={{ fontSize:32 }} />
                </Box>
                <Box sx={{ display:{ xs:'block', md:'none' } }}>
                  <Typography variant="h6">Step 2</Typography>
                  <Typography variant="body2" color="text.secondary">Get predictions</Typography>
                </Box>
              </Box>
              <Box sx={{ mt:2, display:{ xs:'none', md:'block' } }}>
                <Typography variant="h6">2. Price prediction & ranking</Typography>
                <Typography variant="body2" color="text.secondary">We run LSTM forecasts and XGBoost rankings to suggest the best mandis by net profit.</Typography>
              </Box>
            </Box>

            {/* connector */}
            <Box sx={{ display:{ xs:'none', md:'flex' }, alignItems:'center', width:80, justifyContent:'center' }}>
              <Box sx={{ height:4, bgcolor:'grey.300', width:'80%' }} />
            </Box>

            {/** Step 3 */}
            <Box sx={{ flex:1, textAlign:{ xs:'left', md:'center' } }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:2, justifyContent:{ md:'center' } }}>
                <Box sx={{ bgcolor:'#4caf50', color:'#fff', width:64, height:64, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:2 }}>
                  <LocalShippingIcon sx={{ fontSize:32 }} />
                </Box>
                <Box sx={{ display:{ xs:'block', md:'none' } }}>
                  <Typography variant="h6">Step 3</Typography>
                  <Typography variant="body2" color="text.secondary">Choose transport</Typography>
                </Box>
              </Box>
              <Box sx={{ mt:2, display:{ xs:'none', md:'block' } }}>
                <Typography variant="h6">3. Select transport</Typography>
                <Typography variant="body2" color="text.secondary">Compare truck capacities, prices and ETAs from partner aggregators.</Typography>
              </Box>
            </Box>

            {/* connector */}
            <Box sx={{ display:{ xs:'none', md:'flex' }, alignItems:'center', width:80, justifyContent:'center' }}>
              <Box sx={{ height:4, bgcolor:'grey.300', width:'80%' }} />
            </Box>

            {/** Step 4 */}
            <Box sx={{ flex:1, textAlign:{ xs:'left', md:'center' } }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:2, justifyContent:{ md:'center' } }}>
                <Box sx={{ bgcolor:'primary.main', color:'#fff', width:64, height:64, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:2 }}>
                  <CheckCircleIcon sx={{ fontSize:32 }} />
                </Box>
                <Box sx={{ display:{ xs:'block', md:'none' } }}>
                  <Typography variant="h6">Step 4</Typography>
                  <Typography variant="body2" color="text.secondary">Complete & track</Typography>
                </Box>
              </Box>
              <Box sx={{ mt:2, display:{ xs:'none', md:'block' } }}>
                <Typography variant="h6">4. Complete & track</Typography>
                <Typography variant="body2" color="text.secondary">Monitor vehicle location and confirm delivery to complete the sale.</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>



       {/* Testimonials */}
      <Box sx={{ py:8, bgcolor:'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight:700, mb:4, textAlign:'center' }}>What farmers say</Typography>
          <Grid container spacing={3}>
            {[
              { text: 'Using Farm2Mandi I sold my produce at a much better price and saved on transport.', name: 'Ramesh Kumar', place: 'Andhra Pradesh', rating: 5 },
              { text: 'The mandi recommendations are very practical and easy to follow.', name: 'Sita Devi', place: 'Uttar Pradesh', rating: 4 },
              { text: 'Transport options cut costs — great for small farmers.', name: 'Vikram Singh', place: 'Punjab', rating: 5 }
            ].map((t, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ minHeight:200, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  <CardContent>
                    <Box sx={{ display:'flex', gap:1, alignItems:'center', mb:1 }}>
                      <FormatQuoteIcon color="primary" />
                      <Typography variant="body1" sx={{ fontWeight:600 }}>Farmer feedback</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:2 }}>{t.text}</Typography>
                  </CardContent>
                  <CardContent sx={{ pt:0 }}>
                    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight:700 }}>{t.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{t.place}</Typography>
                      </Box>
                      <Rating value={t.rating} readOnly size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Transport CTA */}
      <Box sx={{ bgcolor:'primary.main', color:'primary.contrastText', py:6 }}>
        <Container maxWidth="lg" sx={{ textAlign:'center' }}>
          <Typography variant="h5" sx={{ fontWeight:600 }}>Need transport?</Typography>
          <Typography variant="body1" sx={{ mb:2 }}>Find trucks quickly and share partial capacity to reduce cost.</Typography>
          <Button href="/transport" variant="contained" color="secondary">Find Trucks</Button>
        </Container>
      </Box>

      {/* Footer is now a shared component rendered by App */}
    </div>
  );
}
