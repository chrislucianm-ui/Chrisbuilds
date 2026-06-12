"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, Gamepad2, Calculator, BarChart3, CloudRain, MessageSquareCode, ShieldCheck, RefreshCw, Send, ArrowRight, Play, Square } from "lucide-react";

type AppType = "tictactoe" | "snake" | "calculator" | "expense" | "chat";

interface AppItem {
  id: AppType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const APPS_LIST: AppItem[] = [
  { id: "tictactoe", title: "Tic Tac Toe", description: "Minimalist play grid", icon: <Grid className="w-4 h-4 text-slate-600" /> },
  { id: "snake", title: "Snake Game", description: "Interactive vector trail", icon: <Gamepad2 className="w-4 h-4 text-slate-600" /> },
  { id: "calculator", title: "Calculator", description: "Liquid math evaluator", icon: <Calculator className="w-4 h-4 text-slate-600" /> },
  { id: "expense", title: "Expense Tracker", description: "Clean ledger sheet", icon: <BarChart3 className="w-4 h-4 text-slate-600" /> },
  { id: "chat", title: "Design Concierge", description: "Creative consultant chatbot", icon: <MessageSquareCode className="w-4 h-4 text-slate-600" /> }
];

export default function AppsAndGames() {
  const [activeApp, setActiveApp] = useState<AppType>("tictactoe");

  return (
    <section id="apps-games" className="relative py-32 px-6 md:px-12 bg-transparent z-10">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="flex flex-col items-start mb-20 text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6c00d9] mb-3 block">
            LABS EXPERIMENTS // UTILITIES
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-premium text-slate-800 max-w-2xl leading-tight">
            Playable interactions and <span className="text-slate-400">digital widgets.</span>
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-[#00a0c2] to-[#6c00d9] mt-8" />
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* App Selector */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3">
            {APPS_LIST.map((app) => (
              <button
                key={app.id}
                onClick={() => setActiveApp(app.id)}
                className={`p-4.5 rounded-2xl flex items-center justify-between text-left transition-all duration-500 border cursor-pointer ${
                  activeApp === app.id
                    ? "bg-white/80 border-white/90 shadow-[0_12px_30px_rgba(108,0,217,0.06)] scale-[1.01]"
                    : "bg-white/30 border-white/50 hover:border-white/70 hover:bg-white/45 text-slate-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border bg-white/40 ${
                    activeApp === app.id ? "text-[#6c00d9] border-[#6c00d9]/30" : "text-slate-500 border-slate-200/40"
                  }`}>
                    {app.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold text-xs tracking-wider ${
                      activeApp === app.id ? "text-slate-800" : "text-slate-600"
                    }`}>
                      {app.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{app.description}</p>
                  </div>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  activeApp === app.id ? "text-[#6c00d9] translate-x-1" : "text-slate-400"
                }`} />
              </button>
            ))}
          </div>

          {/* Sandbox Widget Frame */}
          <div className="w-full lg:w-2/3 bg-white/40 border border-white/60 rounded-2xl p-8 min-h-[460px] flex flex-col justify-between relative overflow-hidden shadow-xl backdrop-blur-md">
            <div className="flex justify-between items-center border-b border-slate-200/50 pb-4 text-[9px] font-semibold text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#6c00d9] animate-pulse" /> COMPONENT LOADED</span>
              <span>MOUNT_POINT: /{activeApp.toUpperCase()}</span>
            </div>

            {/* Active app display area */}
            <div className="py-6 flex-1 flex flex-col justify-center relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeApp}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {activeApp === "tictactoe" && <TicTacToeApp />}
                  {activeApp === "snake" && <SnakeApp />}
                  {activeApp === "calculator" && <CalculatorApp />}
                  {activeApp === "expense" && <ExpenseApp />}
                  {activeApp === "chat" && <ChatApp />}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center border-t border-slate-200/50 pt-4 text-[9px] font-semibold text-slate-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#6c00d9]" /> SECURED LAB CONTROLLER</span>
              <span>CHRISBUILDS LABS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------
// 1. TIC TAC TOE APP (Minimalist Play Grid)
// ----------------------------------------------------
function TicTacToeApp() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every(s => s !== "")) return "Draw";
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);
    if (winResult) {
      setWinner(winResult);
      return;
    }

    setIsXNext(false);
  };

  useEffect(() => {
    if (isXNext || winner) return;

    const timer = setTimeout(() => {
      const emptySlots = board.reduce((acc: number[], val, idx) => {
        if (val === "") acc.push(idx);
        return acc;
      }, []);

      if (emptySlots.length > 0) {
        let moveIndex = -1;

        const checkImmediateOpportunity = (player: string) => {
          const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
          ];
          for (const [a, b, c] of lines) {
            const values = [board[a], board[b], board[c]];
            const playerCount = values.filter(v => v === player).length;
            const emptyCount = values.filter(v => v === "").length;
            if (playerCount === 2 && emptyCount === 1) {
              if (board[a] === "") return a;
              if (board[b] === "") return b;
              if (board[c] === "") return c;
            }
          }
          return -1;
        };

        moveIndex = checkImmediateOpportunity("O");
        if (moveIndex === -1) {
          moveIndex = checkImmediateOpportunity("X");
        }
        if (moveIndex === -1) {
          moveIndex = emptySlots[Math.floor(Math.random() * emptySlots.length)];
        }

        const newBoard = [...board];
        newBoard[moveIndex] = "O";
        setBoard(newBoard);

        const winResult = checkWinner(newBoard);
        if (winResult) {
          setWinner(winResult);
        } else {
          setIsXNext(true);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [isXNext, board, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
      <div className="flex justify-between items-center w-full font-semibold text-[10px] text-slate-500">
        <span>PLAYER: X (DEEP PURPLE)</span>
        <span>AI: O (CYAN)</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 w-56 h-56">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            className={`w-full h-full border rounded-2xl flex items-center justify-center text-xl cursor-pointer transition-all duration-300 ${
              cell === ""
                ? "bg-white/40 border-white/60 hover:bg-white/70"
                : cell === "X"
                ? "text-[#6c00d9] bg-white/80 border-[#6c00d9]/30 font-black"
                : "text-[#00a0c2] bg-white/80 border-[#00a0c2]/30 font-black"
            }`}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center w-full mt-2">
        <span className="text-xs text-slate-600 font-semibold">
          {winner
            ? winner === "Draw"
              ? "TIED GAME"
              : `WINNER: ${winner}`
            : isXNext
            ? "Your turn..."
            : "AI is thinking..."}
        </span>
        <button
          onClick={resetGame}
          className="px-4 py-1.5 border border-slate-200 hover:border-slate-300 bg-white/80 text-slate-800 text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. SNAKE GAME APP (Interactive Vector Trail)
// ----------------------------------------------------
function SnakeApp() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
  ]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const GRID_SIZE = 15;

  const generateFood = (currSnake: { x: number; y: number }[]) => {
    let newFood: { x: number; y: number };
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  };

  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
    ]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setIsPlaying(false);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  };

  const handleKeyPress = (x: number, y: number) => {
    if (!isPlaying) return;
    if (direction.x !== 0 && x !== 0) return;
    if (direction.y !== 0 && y !== 0) return;
    setDirection({ x, y });
  };

  useEffect(() => {
    if (!isPlaying) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        if (prevSnake.slice(1).some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, 130);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, direction, food]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 max-w-md mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center font-semibold text-[10px] text-slate-500 px-1">
          <span>SCORE: {score}</span>
          <span>GRID: 15x15</span>
        </div>

        <div
          className="grid gap-[1px] bg-white/25 border border-white/60 p-1 rounded-xl"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: "210px",
            height: "210px",
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);

            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className={`w-full h-full rounded-[2px] ${
                  isHead
                    ? "bg-[#6c00d9] shadow-md"
                    : isSnake
                    ? "bg-[#6c00d9]/40"
                    : isFood
                    ? "bg-[#00a0c2] animate-pulse"
                    : "bg-white/10"
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col justify-between h-52 w-32 gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-full py-2.5 border border-white/60 bg-white/70 hover:bg-white/90 text-slate-800 text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          {isPlaying ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {isPlaying ? "Pause" : "Play"}
        </button>

        {/* Direction Arrows */}
        <div className="grid grid-cols-3 gap-1.5 w-24 mx-auto">
          <div />
          <button
            onClick={() => handleKeyPress(0, -1)}
            className="w-8 h-8 border border-white/60 hover:bg-white/80 bg-white/40 rounded-full flex items-center justify-center text-xs text-slate-800 cursor-pointer shadow-sm"
          >
            ▲
          </button>
          <div />
          <button
            onClick={() => handleKeyPress(-1, 0)}
            className="w-8 h-8 border border-white/60 hover:bg-white/80 bg-white/40 rounded-full flex items-center justify-center text-xs text-slate-800 cursor-pointer shadow-sm"
          >
            ◀
          </button>
          <button
            onClick={() => handleKeyPress(0, 1)}
            className="w-8 h-8 border border-white/60 hover:bg-white/80 bg-white/40 rounded-full flex items-center justify-center text-xs text-slate-800 cursor-pointer shadow-sm"
          >
            ▼
          </button>
          <button
            onClick={() => handleKeyPress(1, 0)}
            className="w-8 h-8 border border-white/60 hover:bg-white/80 bg-white/40 rounded-full flex items-center justify-center text-xs text-slate-800 cursor-pointer shadow-sm"
          >
            ▶
          </button>
        </div>

        <button
          onClick={resetGame}
          className="text-[10px] font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. CALCULATOR APP (Liquid Math Evaluator)
// ----------------------------------------------------
function CalculatorApp() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("0");

  const appendSymbol = (char: string) => {
    setExpr((prev) => prev + char);
  };

  const handleClear = () => {
    setExpr("");
    setResult("0");
  };

  const handleEvaluate = () => {
    try {
      if (!expr) return;
      const cleanExpr = expr.replace(/[^-()\d/*+.]/g, "");
      // eslint-disable-next-line no-eval
      const evalResult = eval(cleanExpr);
      setResult(String(evalResult));
    } catch {
      setResult("Error");
    }
  };

  return (
    <div className="max-w-xs mx-auto bg-white/40 border border-white/60 p-5 rounded-2xl shadow-lg">
      <div className="flex flex-col items-end gap-1 bg-white/60 border border-white/80 p-4 rounded-xl font-semibold mb-4 text-right">
        <span className="text-[10px] text-slate-500">EXPR: {expr || "0"}</span>
        <span className="text-xl font-black text-slate-800">{result}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
        <button onClick={handleClear} className="col-span-2 py-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg hover:bg-red-500/20 cursor-pointer font-bold">C</button>
        <button onClick={() => appendSymbol("/")} className="py-3 bg-white/50 border border-white/70 rounded-lg text-slate-800 hover:bg-white/70 cursor-pointer">/</button>
        <button onClick={() => appendSymbol("*")} className="py-3 bg-white/50 border border-white/70 rounded-lg text-slate-800 hover:bg-white/70 cursor-pointer">*</button>

        {["7", "8", "9", "-"].map((c) => (
          <button
            key={c}
            onClick={() => appendSymbol(c)}
            className={`py-3 rounded-lg cursor-pointer border ${
              c === "-"
                ? "bg-white/50 border-white/70 hover:bg-white/70 text-slate-800"
                : "bg-white/30 border-white/50 hover:bg-white/50 text-slate-700"
            }`}
          >
            {c}
          </button>
        ))}

        {["4", "5", "6", "+"].map((c) => (
          <button
            key={c}
            onClick={() => appendSymbol(c)}
            className={`py-3 rounded-lg cursor-pointer border ${
              c === "+"
                ? "bg-white/50 border-white/70 hover:bg-white/70 text-slate-800"
                : "bg-white/30 border-white/50 hover:bg-white/50 text-slate-700"
            }`}
          >
            {c}
          </button>
        ))}

        {["1", "2", "3", "."].map((c) => (
          <button
            key={c}
            onClick={() => appendSymbol(c)}
            className="py-3 rounded-lg border bg-white/30 border-white/50 hover:bg-white/50 text-slate-700 cursor-pointer"
          >
            {c}
          </button>
        ))}

        <button onClick={() => appendSymbol("0")} className="col-span-2 py-3 bg-white/30 border border-white/50 hover:bg-white/50 text-slate-700 rounded-lg cursor-pointer">0</button>
        <button onClick={handleEvaluate} className="col-span-2 py-3 bg-[#6c00d9] text-white font-bold rounded-lg hover:bg-[#5600b3] cursor-pointer shadow-sm">=</button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. EXPENSE TRACKER APP (Vibrant Ledger)
// ----------------------------------------------------
interface Expense {
  id: number;
  label: string;
  category: "infrastructure" | "ai" | "marketing";
  amount: number;
}

const CATEGORY_COLORS = {
  infrastructure: "bg-[#00a0c2]",
  ai: "bg-[#6c00d9]",
  marketing: "bg-[#d9006c]",
};

function ExpenseApp() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, label: "Studio Cloud Node", category: "infrastructure", amount: 120 },
    { id: 2, label: "AI Translation Key", category: "ai", amount: 200 },
    { id: 3, label: "Fluid Gradients Asset", category: "marketing", amount: 150 }
  ]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<"infrastructure" | "ai" | "marketing">("ai");

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !amount) return;
    const item: Expense = {
      id: Date.now(),
      label,
      category,
      amount: Math.abs(Number(amount)),
    };
    setExpenses((prev) => [item, ...prev]);
    setLabel("");
    setAmount("");
  };

  const removeExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-xl mx-auto text-left">
      {/* Form */}
      <form onSubmit={addExpense} className="flex-1 flex flex-col gap-3">
        <span className="text-[10px] font-semibold text-slate-500 tracking-widest block uppercase">Log Expense</span>
        
        <input
          type="text"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="bg-white/50 border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-purple-300 placeholder-slate-400"
        />

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-white/50 border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-purple-300 placeholder-slate-400"
          />
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="bg-white/50 border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-purple-300"
          >
            <option value="ai">AI</option>
            <option value="infrastructure">INFRA</option>
            <option value="marketing">MKTG</option>
          </select>
        </div>

        <button type="submit" className="w-full py-2 bg-[#6c00d9] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer hover:bg-[#5600b3]">
          Record Expense
        </button>

        <div className="border border-slate-200/50 rounded-xl p-3 bg-white/20 flex flex-col gap-2 text-[10px] text-slate-500 font-semibold">
          {["ai", "infrastructure", "marketing"].map((cat) => {
            const catSum = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
            const percentage = total > 0 ? (catSum / total) * 100 : 0;

            return (
              <div key={cat} className="flex flex-col gap-1">
                <div className="flex justify-between uppercase">
                  <span>{cat}</span>
                  <span className="text-slate-800">${catSum} ({percentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full h-1 bg-slate-200/50 rounded-full overflow-hidden">
                  <div className={`h-full ${CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS]}`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </form>

      {/* Ledger list */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-slate-200/50 pb-2 text-[10px] text-slate-500 font-semibold">
          <span>Ledger Statement</span>
          <span className="text-slate-800 font-bold">Total: ${total}</span>
        </div>

        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
          {expenses.map((exp) => (
            <div key={exp.id} className="flex justify-between items-center p-2.5 border border-white/60 bg-white/30 rounded-lg text-[10px] group">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[exp.category]}`} />
                <span className="text-slate-700 font-semibold">{exp.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-800 font-bold">${exp.amount}</span>
                <button
                  onClick={() => removeExpense(exp.id)}
                  className="text-red-500 hover:text-red-700 transition-colors cursor-pointer font-bold px-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <span className="text-center py-8 text-slate-400 text-[10px] font-semibold">No transaction ledger data</span>
          )}
        </div>
      </div>
    </div>
  );
}



// ----------------------------------------------------
// 6. DESIGN CONCIERGE (Vibrant Chatbot)
// ----------------------------------------------------
interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

const AI_RESPONSES = [
  "Hello. Your request has been logged in our creative studio routing pipeline.",
  "We design digital experiences that people remember. Our specialties include 3D WebGL scenes and fluid gradients.",
  "At ChrisBuilds, we balance visual artistry with high-speed compilation to achieve 60 FPS performance.",
  "Would you like to schedule a strategy session? Leave a transmission log in our contact section below.",
  "Our stack is optimized for React, Next.js, and mobile cross-platform SDKs."
];

function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "ai", text: "Hello. How can we support your digital product requirements today?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    setTimeout(() => {
      const response = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 750);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="max-w-md mx-auto flex flex-col h-[280px] border border-white/60 rounded-2xl bg-white/30 p-4 justify-between shadow-md text-left">
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 text-xs mb-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
            <span className="text-[8px] font-semibold uppercase mb-0.5 text-slate-400">
              {m.sender === "user" ? "Inquirer" : "ChrisBuilds Partner"}
            </span>
            <div
              className={`p-2.5 rounded-xl border leading-relaxed max-w-[85%] font-medium ${
                m.sender === "user"
                  ? "bg-white/80 border-slate-200 text-slate-800"
                  : "bg-white/40 border-white/50 text-slate-700 shadow-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex flex-col items-start">
            <span className="text-[8px] font-semibold uppercase mb-0.5 text-slate-400">ChrisBuilds Partner</span>
            <div className="p-2 bg-white/40 border border-white/50 rounded-xl text-slate-500 font-bold animate-pulse">
              typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-200/50 pt-3">
        <input
          type="text"
          placeholder="Ask a consultant..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-white/50 border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-purple-300 placeholder-slate-400"
        />
        <button type="submit" className="p-2 border border-slate-200 hover:bg-slate-50 bg-white/80 text-slate-700 rounded-lg flex items-center justify-center cursor-pointer shadow-sm">
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
