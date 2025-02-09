'use client';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../../shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import LogoCollection from './components/LogoCollection';
import Pricing from './components/Pricing';
import Features from './components/Features';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { User } from 'firebase/auth';

export default function MarketingPage(props: { disableCustomTheme?: boolean, currentUser?: User }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar initialUser={props.currentUser ?? {} as User}/>
      <Hero />
      <div>
        <LogoCollection />
        <Features />
        <Divider />
        <Pricing initialUser={props.currentUser ?? {} as User} />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
