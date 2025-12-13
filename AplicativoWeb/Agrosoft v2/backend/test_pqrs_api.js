
async function test() {
    try {
        const response = await fetch('http://localhost:4000/api/pqrs');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Data count:", data.data ? data.data.length : 'N/A');
        if (data.data && data.data.length > 0) {
            console.log("First item:", JSON.stringify(data.data[0], null, 2));
        } else {
            console.log("Response:", data);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

test();
