/**
 * Tool: Epoch Converter
 */
window.mountTool_epoch_converter = function (containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div class="tool-panel">
            <div style="background-color: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius-md); border: 1px solid var(--border-color); text-align: center; margin-bottom: 2rem;">
                <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Current Unix Epoch Time</div>
                <div id="epoch-live" style="font-size: 2.5rem; font-weight: 700; color: var(--accent-primary); font-family: monospace;">---</div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                
                <!-- Epoch to Human -->
                <div>
                    <h3 style="margin-bottom: 1rem; font-size: 1rem;">Epoch to Date</h3>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <input type="number" id="ep-input" style="flex: 1; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-family: monospace;">
                        <button id="btn-ep-now" class="btn btn-secondary">Now</button>
                    </div>
                    
                    <div style="background-color: var(--bg-primary); padding: 1rem; border-radius: var(--border-radius-sm); border: 1px dashed var(--border-color);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="color: var(--text-secondary); font-size: 0.875rem;">Local Time:</span>
                            <span id="ep-res-local" style="font-weight: 600;"></span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--text-secondary); font-size: 0.875rem;">GMT Time:</span>
                            <span id="ep-res-gmt" style="font-weight: 600;"></span>
                        </div>
                    </div>
                </div>

                <!-- Human to Epoch -->
                <div>
                     <h3 style="margin-bottom: 1rem; font-size: 1rem;">Date to Epoch</h3>
                     <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem;">
                         <div>
                             <label style="display: block; margin-bottom: 0.25rem; color: var(--text-secondary); font-size: 0.75rem;">Date</label>
                             <input type="date" id="date-input" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
                         </div>
                         <div>
                             <label style="display: block; margin-bottom: 0.25rem; color: var(--text-secondary); font-size: 0.75rem;">Time</label>
                             <input type="time" step="1" id="time-input" style="width: 100%; padding: 0.75rem; background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);">
                         </div>
                     </div>
                     <button id="btn-convert-date" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">Convert to Epoch</button>
                     
                     <div style="background-color: var(--bg-primary); padding: 1rem; border-radius: var(--border-radius-sm); border: 1px dashed var(--border-color); text-align: center;">
                        <span id="date-res-ep" style="font-size: 1.5rem; font-weight: 700; font-family: monospace;">---</span>
                     </div>
                </div>

            </div>
        </div>
    `;

    const liveDisplay = document.getElementById('epoch-live');
    const epInput = document.getElementById('ep-input');
    const resLocal = document.getElementById('ep-res-local');
    const resGmt = document.getElementById('ep-res-gmt');

    const dateInput = document.getElementById('date-input');
    const timeInput = document.getElementById('time-input');
    const dateRes = document.getElementById('date-res-ep');

    // Live Clock
    setInterval(() => {
        liveDisplay.textContent = Math.floor(Date.now() / 1000);
    }, 1000);

    // Initial setup
    const now = new Date();
    epInput.value = Math.floor(now.getTime() / 1000);
    updateEpochToDate();

    // YYYY-MM-DD format
    dateInput.value = now.toISOString().split('T')[0];
    timeInput.value = now.toTimeString().slice(0, 8);

    function updateEpochToDate() {
        let val = parseInt(epInput.value);
        if (isNaN(val)) return;

        // auto-detect ms
        if (epInput.value.length >= 13) {
            // it's in ms
        } else {
            val *= 1000;
        }

        const d = new Date(val);
        if (d.toString() !== 'Invalid Date') {
            resLocal.textContent = d.toLocaleString();
            resGmt.textContent = d.toUTCString();
        } else {
            resLocal.textContent = 'Invalid Date';
            resGmt.textContent = 'Invalid Date';
        }
    }

    epInput.addEventListener('input', updateEpochToDate);
    document.getElementById('btn-ep-now').addEventListener('click', () => {
        epInput.value = Math.floor(Date.now() / 1000);
        updateEpochToDate();
    });

    document.getElementById('btn-convert-date').addEventListener('click', () => {
        if (!dateInput.value) return;
        const dStr = timeInput.value ? `${dateInput.value}T${timeInput.value}` : dateInput.value;
        const d = new Date(dStr);
        if (d.toString() !== 'Invalid Date') {
            dateRes.textContent = Math.floor(d.getTime() / 1000);
        } else {
            dateRes.textContent = "Error";
        }
    });

};
