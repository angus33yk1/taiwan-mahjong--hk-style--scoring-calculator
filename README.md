# Taiwan Mahjong (HK Style) Scoring Calculator 🀄

A professional, feature-rich web application designed for scoring **Taiwan Mahjong (16 tiles, HK Style)**. This tool handles complex pattern detection, dealer streaks, and wait-type analysis with a modern, responsive interface.

## ✨ Features

- **Intelligent Pattern Detection**: Automatically identifies complex hands such as "Five Genders", "No Honors No Flowers", and "Grand All Chows".
- **Advanced Dealer System**: Implements the specific `(n x 2) + 1` fan formula for consecutive dealer wins (streak and carry) for accurate scoring.
- **Interactive Hand Builder**: Build your 17-tile hand with ease. Pick your winning tile directly from the hand display with high-contrast highlighting and badge indicators.
- **Mutual Exclusivity Logic**: The UI prevents illegal combinations by grouping exclusive events (e.g., Heavenly vs. Earthly vs. Human wins, or Full vs. Semi-Beggars).
- **Smart Validation**: Context-aware UI disables kong-related special events (Robbing the Kong, Kong Draw) unless a 4-of-a-kind set is detected in your hand.
- **Wait-Type Analytics**: Automatically detects "True Solo" situations (Edge wait, Middle wait, or Eyes wait) by analyzing your hand decomposition.
- **Premium Modern UI**: A sleek, responsive design featuring Light and Dark modes, optimized scaling for better visibility, and smooth micro-animations.
- **Bilingual Support**: Fully localized interface with a seamless toggle between **Traditional Chinese (中文)** and **English (ENG)**.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/taiwan-mahjong-hk-scoring-calculator.git
   ```
2. Navigate to the directory:
   ```bash
   cd taiwan-mahjong-hk-scoring-calculator
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Context API

## 📝 License
This project is for personal use and enthusiasts. Feel free to contribute!

---
*Created with ❤️ for the Mahjong community.*
