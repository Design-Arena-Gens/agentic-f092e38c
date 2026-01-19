import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const [cookies, setCookies] = useState(0)
  const [cookiesPerSecond, setCookiesPerSecond] = useState(0)
  const [upgrades, setUpgrades] = useState({
    cursor: { count: 0, cost: 15, cps: 0.1, name: 'Cursor' },
    grandma: { count: 0, cost: 100, cps: 1, name: 'Grandma' },
    farm: { count: 0, cost: 1100, cps: 8, name: 'Cookie Farm' },
    mine: { count: 0, cost: 12000, cps: 47, name: 'Cookie Mine' },
    factory: { count: 0, cost: 130000, cps: 260, name: 'Cookie Factory' },
    bank: { count: 0, cost: 1400000, cps: 1400, name: 'Cookie Bank' },
    temple: { count: 0, cost: 20000000, cps: 7800, name: 'Cookie Temple' },
    wizard: { count: 0, cost: 330000000, cps: 44000, name: 'Wizard Tower' }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCookies(prev => prev + cookiesPerSecond / 10)
    }, 100)
    return () => clearInterval(interval)
  }, [cookiesPerSecond])

  useEffect(() => {
    let totalCPS = 0
    Object.values(upgrades).forEach(upgrade => {
      totalCPS += upgrade.count * upgrade.cps
    })
    setCookiesPerSecond(totalCPS)
  }, [upgrades])

  const handleCookieClick = () => {
    setCookies(prev => prev + 1)
  }

  const buyUpgrade = (key) => {
    const upgrade = upgrades[key]
    if (cookies >= upgrade.cost) {
      setCookies(prev => prev - upgrade.cost)
      setUpgrades(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          count: prev[key].count + 1,
          cost: Math.ceil(prev[key].cost * 1.15)
        }
      }))
    }
  }

  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
    return Math.floor(num).toLocaleString()
  }

  return (
    <>
      <Head>
        <title>Cookie Clicker</title>
        <meta name="description" content="Cookie Clicker Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container">
        <div className="game-area">
          <h1 className="title">🍪 Cookie Clicker</h1>
          <div className="stats">
            <div className="cookie-count">{formatNumber(cookies)} cookies</div>
            <div className="cps">per second: {formatNumber(cookiesPerSecond)}</div>
          </div>
          <button className="cookie-button" onClick={handleCookieClick}>
            🍪
          </button>
        </div>

        <div className="upgrades-panel">
          <h2>Upgrades</h2>
          <div className="upgrades-list">
            {Object.entries(upgrades).map(([key, upgrade]) => (
              <button
                key={key}
                className={`upgrade-item ${cookies >= upgrade.cost ? 'affordable' : 'unaffordable'}`}
                onClick={() => buyUpgrade(key)}
                disabled={cookies < upgrade.cost}
              >
                <div className="upgrade-header">
                  <span className="upgrade-name">{upgrade.name}</span>
                  <span className="upgrade-count">{upgrade.count}</span>
                </div>
                <div className="upgrade-info">
                  <span className="upgrade-cps">+{upgrade.cps}/s</span>
                  <span className="upgrade-cost">{formatNumber(upgrade.cost)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
