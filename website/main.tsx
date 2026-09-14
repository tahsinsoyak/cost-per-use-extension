import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/manrope';
import '@fontsource-variable/jetbrains-mono';
import Website from './Website';
import './style.css';
import './motion.css';
import './calculator-polish.css';

createRoot(document.getElementById('root')!).render(<React.StrictMode><Website /></React.StrictMode>);

import './mobile-menu.css';
import './mobile-alignment.css';
import './localization.css';
