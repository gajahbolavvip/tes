
"use client";

import { useEffect, useState } from "react";
import "./stocks.css";

const stocks = [
  { symbol: "PLTR", name: "Palantir Technologies" },
  { symbol: "INTC", name: "Intel Corporation" },
];

export default function Home() {
  const [quotes, setQuotes] = useState({});

  useEffect(() => {
    async function loadQuotes() {
      for (const stock of stocks) {
        try {
          const response = await fetch(
            `/api/quote?symbol=${stock.symbol}`
          );
          if (!response.ok) continue;

          const data = await response.json();
          setQuotes((prev) => ({
            ...prev,
            [stock.symbol]: data,
          }));
        } catch (error) {
          console.error("Gagal memuat harga:", error);
        }
      }
    }

    loadQuotes();
    const timer = setInterval(loadQuotes, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="stock-page">
      <header className="topbar">
        <h2>📈 Stockfolio</h2>
        <p>Live Market Dashboard · NASDAQ</p>
      </header>

      <section className="stock-grid">
        {stocks.map((stock) => {
          const quote = quotes[stock.symbol];
          const change = quote?.changePercent ?? null;
          const up = change !== null && change >= 0;

          return (
            <article className="stock-card" key={stock.symbol}>
              <div className="stock-heading">
                <div>
                  <h2>{stock.symbol}</h2>
                  <p>{stock.name}</p>
                </div>

                {quote && (
                  <div
                    className={`daily-change ${
                      up ? "positive" : "negative"
                    }`}
                  >
                    <span>{up ? "▲" : "▼"}</span>
                    {up ? "+" : ""}
                    {change.toFixed(2)}%
                    <small>1 hari</small>
                  </div>
                )}
              </div>

              {quote && (
                <div className="price-row">
                  <span>Harga sekarang</span>
                  <strong>
                    ${Number(quote.current).toFixed(2)}
                  </strong>
                </div>
              )}

              <div className="chart-frame">
                <iframe
                  title={`${stock.symbol} TradingView chart`}
                  src={`https://s.tradingview.com/widgetembed/?symbol=${stock.symbol}&interval=D&hidesidetoolbar=0&symboledit=0&saveimage=0&toolbarbg=0B1220&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1&studies=%5B%5D`}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </article>
          );
        })}
      </section>

      <footer>
        Data pasar dapat tertunda. Bukan saran investasi.
      </footer>
    </main>
  );
}
