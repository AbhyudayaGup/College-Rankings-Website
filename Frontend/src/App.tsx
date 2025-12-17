import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, CollegeDetailPage, SearchPage } from './pages';
import { ErrorBoundary, ParticleBackground } from './components';
import { ParticlePresetKey, PARTICLE_PRESETS } from './components/particlePresets';

function App() {
  const [backgroundPreset, setBackgroundPreset] = React.useState<ParticlePresetKey>('light');

  const currentTheme = PARTICLE_PRESETS[backgroundPreset];

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen overflow-hidden">
        {/* Dynamic particle background */}
        <div className={`fixed inset-0 -z-10 ${currentTheme.background}`}>
          <ParticleBackground presetKey={backgroundPreset} className="absolute inset-0 pointer-events-none" />
        </div>
        <Router>
          <Routes>
            <Route path="/" element={<Home currentPreset={backgroundPreset} onPresetChange={setBackgroundPreset} />} />
            <Route path="/college/:id" element={<CollegeDetailPage currentPreset={backgroundPreset} onPresetChange={setBackgroundPreset} />} />
            <Route path="/search" element={<SearchPage currentPreset={backgroundPreset} onPresetChange={setBackgroundPreset} />} />
            <Route path="/international" element={<Home currentPreset={backgroundPreset} onPresetChange={setBackgroundPreset} />} />
            <Route path="/american" element={<Home currentPreset={backgroundPreset} onPresetChange={setBackgroundPreset} />} />
          </Routes>
        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default App;
