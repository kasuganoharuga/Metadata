const csInterface = new CSInterface();

document.getElementById('importBtn').onclick = () => {
    setStatus("Importing CSV...");
    window.CSVDB.readCSV(function(err, records) {
        if (err) return setStatus("CSV read error: " + err);
        const mapping = loadMapping();
        csInterface.evalScript(
            `importMetadataFromCSV(${JSON.stringify(records)}, ${JSON.stringify(mapping)})`,
            (res) => setStatus("Imported to Premiere!")
        );
    });
};

document.getElementById('exportBtn').onclick = () => {
    setStatus("Exporting from Premiere...");
    csInterface.evalScript("exportMetadataToCSV()", function(metadataJSON) {
        let metadata;
        try {
            metadata = JSON.parse(metadataJSON);
        } catch(e) {
            setStatus("Premiere metadata error: " + e);
            return;
        }
        window.CSVDB.writeCSV(metadata, function(err) {
            if (err) setStatus("CSV write error: " + err);
            else setStatus("Exported to CSV!");
        });
    });
};

document.getElementById('settingsBtn').onclick = () => {
    document.getElementById('settingsModal').style.display = "block";
    renderMappingTable();
};

document.getElementById('csvBtn').onclick = () => {
    window.CSVDB.openCSVFolder();
};

document.querySelector('.close').onclick = () => {
    document.getElementById('settingsModal').style.display = "none";
};

document.getElementById('saveMappingBtn').onclick = () => {
    saveMapping();
    setStatus("Mapping saved.");
    document.getElementById('settingsModal').style.display = "none";
};

function setStatus(msg) {
    document.getElementById('status').innerText = msg;
}

function renderMappingTable() {
    // For demo, just hard-coded mapping rows (customize as needed)
    document.getElementById('mappingTable').innerHTML = `
        <table>
            <tr><th>CSV Column</th><th>Premiere Column</th></tr>
            <tr><td>Scene</td><td><input id="m_Scene" value="${loadMapping().Scene || 'Scene'}"></td></tr>
            <tr><td>Shot</td><td><input id="m_Shot" value="${loadMapping().Shot || 'Shot'}"></td></tr>
            <tr><td>Description</td><td><input id="m_Description" value="${loadMapping().Description || 'Description'}"></td></tr>
        </table>
    `;
}

function saveMapping() {
    const mapping = {
        Scene: document.getElementById('m_Scene').value,
        Shot: document.getElementById('m_Shot').value,
        Description: document.getElementById('m_Description').value
    };
    localStorage.setItem('columnMapping', JSON.stringify(mapping));
}

function loadMapping() {
    try {
        return JSON.parse(localStorage.getItem('columnMapping')) || {
            Scene: "Scene",
            Shot: "Shot",
            Description: "Description"
        };
    } catch {
        return {
            Scene: "Scene",
            Shot: "Shot",
            Description: "Description"
        };
    }
}