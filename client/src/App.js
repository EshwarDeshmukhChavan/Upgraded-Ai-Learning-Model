import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [prompt, setPrompt] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerateContent = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/generate-content', {
                prompt,
            });
            setGeneratedContent(res.data.content);
        } catch (error) {
            console.error('Error generating content:', error);
            setGeneratedContent('Error generating content: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <div className="container">
                <h1>AI Learning Companion</h1>
                <input 
                    type="text" 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)} 
                    placeholder="Enter your prompt here" 
                    className="prompt-input"
                />
                <button onClick={handleGenerateContent} disabled={loading} className="generate-button">
                    {loading ? 'Generating...' : 'Generate Content'}
                </button>
                <div className="content-area">
                    <h2>Generated Content:</h2>
                    <p>{generatedContent}</p>
                </div>
            </div>
        </div>
    );
}

export default App;