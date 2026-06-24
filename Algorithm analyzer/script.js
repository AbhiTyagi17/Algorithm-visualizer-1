// script.js
let array = [];
let arraySize = 20;
let speed = 50;
let isRunning = false;
let isPaused = false;
let timeoutId = null;
let comparisons = 0;
let swaps = 0;
let startTime = null;

const barsContainer = document.getElementById('bars');
const algorithmSelect = document.getElementById('algorithm');
const sizeSlider = document.getElementById('size');
const sizeValue = document.getElementById('sizeValue');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const stopBtn = document.getElementById('stop');
const generateBtn = document.getElementById('generate');

const comparisonsEl = document.getElementById('comparisons');
const swapsEl = document.getElementById('swaps');
const timeEl = document.getElementById('time');

const algoTitle = document.getElementById('algo-title');
const algoDesc = document.getElementById('algo-desc');
const binaryInfo = document.getElementById('binary-info');

// Update labels
sizeSlider.addEventListener('input', () => {
    arraySize = parseInt(sizeSlider.value);
    sizeValue.textContent = arraySize;
});

speedSlider.addEventListener('input', () => {
    speed = parseInt(speedSlider.value);
    const speedText = speed > 70 ? 'Fast' : speed > 30 ? 'Medium' : 'Slow';
    speedValue.textContent = speedText;
});

function generateArray() {
    array = [];
    barsContainer.innerHTML = '';
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 300) + 50);
    }
    renderBars();
}

function renderBars() {
    barsContainer.innerHTML = '';
    const barWidth = Math.max(8, Math.floor(800 / array.length));
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value}px`;
        bar.style.width = `${barWidth}px`;
        bar.dataset.index = index;
        barsContainer.appendChild(bar);
    });
}

async function sleep(ms) {
    return new Promise(resolve => {
        timeoutId = setTimeout(resolve, ms);
    });
}

async function bubbleSort() {
    const n = array.length;
    let swapped;
    
    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (!isRunning) return;
            while (isPaused) await sleep(100);
            
            comparisons++;
            updateStats();
            
            highlightBars(j, j+1, 'comparing');
            
            await sleep(2000 / speed);
            
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swaps++;
                updateStats();
                highlightBars(j, j+1, 'swapping');
                await sleep(300 / speed);
                renderBars();
            }
        }
    }
}

async function selectionSort() {
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        
        for (let j = i + 1; j < n; j++) {
            if (!isRunning) return;
            while (isPaused) await sleep(100);
            
            comparisons++;
            updateStats();
            
            highlightBars(minIdx, j, 'comparing');
            await sleep(1500 / speed);
            
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        
        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            swaps++;
            updateStats();
            highlightBars(i, minIdx, 'swapping');
            await sleep(400 / speed);
            renderBars();
        }
    }
}

async function binarySearch() {
    binaryInfo.classList.remove('hidden');
    let target = array[Math.floor(array.length / 2)]; // pick middle as target for demo
    document.getElementById('target').textContent = target;
    
    let low = 0;
    let high = array.length - 1;
    
    // Sort first for binary search
    const sortedArray = [...array].sort((a,b)=>a-b);
    array = sortedArray;
    renderBars();
    
    await sleep(800);
    
    while (low <= high) {
        if (!isRunning) return;
        while (isPaused) await sleep(100);
        
        const mid = Math.floor((low + high) / 2);
        
        document.getElementById('low').textContent = low;
        document.getElementById('mid').textContent = mid;
        document.getElementById('high').textContent = high;
        
        highlightBars(mid, mid, 'comparing');
        comparisons++;
        updateStats();
        
        await sleep(1200 / speed);
        
        if (array[mid] === target) {
            highlightBars(mid, mid, 'swapping'); // found
            alert(`Target ${target} found at index ${mid}!`);
            return;
        } else if (array[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
        renderBars();
        await sleep(600 / speed);
    }
    alert("Target not found");
}

// Helper to highlight bars
function highlightBars(idx1, idx2, className) {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => bar.classList.remove('comparing', 'swapping'));
    
    if (bars[idx1]) bars[idx1].classList.add(className);
    if (bars[idx2] && idx1 !== idx2) bars[idx2].classList.add(className);
}

function updateStats() {
    comparisonsEl.textContent = comparisons;
    swapsEl.textContent = swaps;
    if (startTime) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        timeEl.textContent = elapsed;
    }
}

async function startVisualization() {
    if (isRunning) return;
    
    isRunning = true;
    isPaused = false;
    comparisons = 0;
    swaps = 0;
    startTime = Date.now();
    updateStats();
    
    const algo = algorithmSelect.value;
    
    if (algo === 'bubble') {
        await bubbleSort();
    } else if (algo === 'selection') {
        await selectionSort();
    } else if (algo === 'binary') {
        await binarySearch();
    }
    
    isRunning = false;
    // Mark all as sorted
    document.querySelectorAll('.bar').forEach(bar => bar.classList.add('sorted'));
}

function stopVisualization() {
    isRunning = false;
    isPaused = false;
    if (timeoutId) clearTimeout(timeoutId);
    generateArray(); // reset
    binaryInfo.classList.add('hidden');
}

function togglePause() {
    if (!isRunning) return;
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
}

// Event Listeners
startBtn.addEventListener('click', startVisualization);
pauseBtn.addEventListener('click', togglePause);
stopBtn.addEventListener('click', stopVisualization);
generateBtn.addEventListener('click', () => {
    stopVisualization();
    generateArray();
});

algorithmSelect.addEventListener('change', () => {
    const algo = algorithmSelect.value;
    if (algo === 'bubble') {
        algoTitle.textContent = 'Bubble Sort';
        algoDesc.textContent = 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in wrong order.';
    } else if (algo === 'selection') {
        algoTitle.textContent = 'Selection Sort';
        algoDesc.textContent = 'Selection Sort divides the input into sorted and unsorted regions and repeatedly selects the smallest element from unsorted part.';
    } else if (algo === 'binary') {
        algoTitle.textContent = 'Binary Search';
        algoDesc.textContent = 'Binary Search finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.';
    }
});

// Initialize
generateArray();