import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [prompts, setPrompts] = useState(['']); // Array to hold multiple prompts
    const [generatedContents, setGeneratedContents] = useState([]); // Array to hold generated contents
    const inputRefs = useRef([]); // Array to hold references to input fields

    const handleInputChange = (index, value) => {
        const newPrompts = [...prompts];
        newPrompts[index] = value;
        setPrompts(newPrompts);
    };

    const handleKeyPress = async (index, event) => {
        if (event.key === 'Enter') {
            await generateContent(index);
        }
    };

    const generateContent = async (index) => {
        const prompt = prompts[index].trim();
        if (!prompt) return; // Ignore empty prompts

        try {
            const res = await axios.post('http://localhost:5000/api/generate-content', { prompt });
            const newContents = [...generatedContents];
            newContents[index] = res.data.content; // Store generated content for this prompt

            setGeneratedContents(newContents);

            // Move focus to the next input field
            if (index === prompts.length - 1) {
                setPrompts([...prompts, '']); // Add a new empty input field
                setTimeout(() => {
                    inputRefs.current[index + 1]?.focus(); // Focus on the new input field
                }, 100); // Delay to ensure the new input is rendered
            } else {
                inputRefs.current[index + 1]?.focus(); // Focus on the next existing input field
            }
        } catch (error) {
            console.error('Error generating content:', error);
            setGeneratedContents(prev => [...prev, 'Error generating content']);
        }
    };

    return (
        <div className="App">
            <div className="container">
                <h1>AI Learning Companion</h1>
                {prompts.map((prompt, index) => (
                    <div key={index} className="input-group">
                        <input 
                            type="text" 
                            value={prompt} 
                            onChange={(e) => handleInputChange(index, e.target.value)} 
                            onKeyPress={(e) => handleKeyPress(index, e)} 
                            placeholder="Enter your prompt here" 
                            className="prompt-input"
                            ref={el => inputRefs.current[index] = el} // Set reference for each input
                        />
                        <button 
                            onClick={() => generateContent(index)} 
                            className="generate-button"
                            style={{ display: generatedContents[index] ? 'none' : 'block' }} // Hide button if content is generated
                        >
                            Generate Content
                        </button>
                        {generatedContents[index] && (
                            <div className="content-area">
                                <h2>Generated Content:</h2>
                                <p>{generatedContents[index]}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;