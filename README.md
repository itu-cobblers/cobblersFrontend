# bootIT

An online compiler frontend for private bootcamp usage.

## Overview

bootIT provides a browser-based coding environment where students can write and run code directly in the browser. It features a Monaco editor (the same editor powering VS Code), a task/progress sidebar, and executes code via a backend API powered by [Piston](https://github.com/engineer-man/piston).

## Features

- Monaco Editor for a rich coding experience
- Multi-language code execution via Piston API
- Task and progress tracking sidebar
- Built for private bootcamp use

## Tech Stack

- **Frontend:** React + Vite
- **Editor:** Monaco Editor
- **Code Execution:** Piston (via backend API)

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  App.jsx        # Root component
  main.jsx       # Entry point
```

## Backend

Code execution is handled by a separate backend repo that proxies requests to the Piston API.
