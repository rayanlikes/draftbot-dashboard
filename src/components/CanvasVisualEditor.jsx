import React, { useState, useEffect, useRef } from 'react';
import { visualService } from '../services/api';

const CanvasVisualEditor = ({ type, serverId }) => {
  const canvasRef = useRef(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [category, setCategory] = useState(type === 'slots' ? 'scrim' : 'top_10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Canvas state
  const [canvasElements, setCanvasElements] = useState([
    // Default elements
    { id: 'background', type: 'rectangle', x: 0, y: 0, width: 800, height: 400, fill: '#121212', isBackground: true },
    { id: 'title', type: 'text', x: 400, y: 50, text: type === 'slots' ? 'Scrim Slots' : 'Leaderboard', font: '30px Arial', fill: '#ffffff', textAlign: 'center' },
    { id: 'logo', type: 'image', x: 50, y: 50, width: 100, height: 100, src: '', visible: false }
  ]);
  
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Available backgrounds
  const backgrounds = [
    { id: 'solid', name: 'Solid Color', preview: '#121212' },
    { id: 'gradient1', name: 'Blue Gradient', preview: 'linear-gradient(135deg, #1e3c72, #2a5298)' },
    { id: 'gradient2', name: 'Purple Gradient', preview: 'linear-gradient(135deg, #4b6cb7, #182848)' },
    { id: 'gradient3', name: 'Dark Gradient', preview: 'linear-gradient(135deg, #232526, #414345)' },
    { id: 'pattern1', name: 'Hexagon Pattern', preview: 'url(https://www.transparenttextures.com/patterns/hexellence.png)' }
  ];
  
  // Categories based on type
  const categories = type === 'slots' 
    ? [
        { value: 'scrim', label: 'Regular Scrim' },
        { value: 'pro_scrim', label: 'Pro Scrim' },
        { value: 'girls_scrim', label: 'Girls Scrim' }
      ]
    : [
        { value: 'top_8', label: 'Top 8 Teams' },
        { value: 'top_10', label: 'Top 10 Teams' },
        { value: 'overall', label: 'Overall Standings' },
        { value: 'girls', label: 'Girls Leaderboard' }
      ];

  // Fetch templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!serverId) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = type === 'slots'
          ? await visualService.getSlotTemplates(serverId)
          : await visualService.getLeaderboardTemplates(serverId);
        
        setTemplates(data);
        // If there's a saved template, use it
        if (data.savedTemplate) {
          setSelectedTemplate(data.savedTemplate.style);
          setCategory(data.savedTemplate.category);
          
          // If the saved template has canvas elements, load them
          if (data.savedTemplate.canvasElements) {
            setCanvasElements(data.savedTemplate.canvasElements);
          }
        }
      } catch (err) {
        console.error('Failed to fetch templates:', err);
        setError(`Failed to load templates: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [serverId, type]);

  // Draw canvas whenever elements change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all elements
    canvasElements.forEach(element => {
      if (!element.visible && element.visible !== undefined) return;
      
      switch (element.type) {
        case 'rectangle':
          ctx.fillStyle = element.fill;
          ctx.fillRect(element.x, element.y, element.width, element.height);
          
          if (element.stroke) {
            ctx.strokeStyle = element.stroke;
            ctx.lineWidth = element.strokeWidth || 2;
            ctx.strokeRect(element.x, element.y, element.width, element.height);
          }
          break;
          
        case 'text':
          ctx.font = element.font;
          ctx.fillStyle = element.fill;
          ctx.textAlign = element.textAlign || 'left';
          ctx.textBaseline = element.textBaseline || 'top';
          ctx.fillText(element.text, element.x, element.y);
          break;
          
        case 'image':
          if (element.src) {
            const img = new Image();
            img.src = element.src;
            img.onload = () => {
              ctx.drawImage(img, element.x, element.y, element.width, element.height);
            };
          }
          break;
          
        default:
          break;
      }
      
      // Draw selection outline if element is selected
      if (selectedElement && selectedElement.id === element.id) {
        ctx.strokeStyle = '#00a8ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(element.x - 5, element.y - 5, element.width + 10, element.height + 10);
        ctx.setLineDash([]);
      }
    });
  }, [canvasElements, selectedElement]);

  // Canvas event handlers
  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find if we clicked on an element (in reverse order to get top elements first)
    for (let i = canvasElements.length - 1; i >= 0; i--) {
      const el = canvasElements[i];
      if (el.isBackground) continue; // Skip background
      
      if (
        x >= el.x && 
        x <= el.x + el.width && 
        y >= el.y && 
        y <= el.y + el.height
      ) {
        setSelectedElement(el);
        setIsDragging(true);
        setDragStart({ x, y });
        return;
      }
    }
    
    // If we didn't click on any element, deselect
    setSelectedElement(null);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDragging || !selectedElement) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    
    // Update element position
    const updatedElements = canvasElements.map(el => {
      if (el.id === selectedElement.id) {
        return {
          ...el,
          x: el.x + dx,
          y: el.y + dy
        };
      }
      return el;
    });
    
    setCanvasElements(updatedElements);
    setDragStart({ x, y });
    
    // Update selected element reference
    const updatedElement = updatedElements.find(el => el.id === selectedElement.id);
    setSelectedElement(updatedElement);
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  // Add new element
  const addElement = (type) => {
    const id = `${type}_${Date.now()}`;
    let newElement;
    
    switch (type) {
      case 'text':
        newElement = {
          id,
          type: 'text',
          x: 200,
          y: 200,
          width: 200,
          height: 30,
          text: 'New Text',
          font: '20px Arial',
          fill: '#ffffff',
          textAlign: 'left'
        };
        break;
        
      case 'rectangle':
        newElement = {
          id,
          type: 'rectangle',
          x: 200,
          y: 200,
          width: 100,
          height: 100,
          fill: '#7289da',
          stroke: '#ffffff',
          strokeWidth: 2
        };
        break;
        
      case 'image':
        // Open file dialog
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const newImageElement = {
                id,
                type: 'image',
                x: 200,
                y: 200,
                width: 100,
                height: 100,
                src: event.target.result,
                visible: true
              };
              
              setCanvasElements([...canvasElements, newImageElement]);
              setSelectedElement(newImageElement);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
        return; // Return early as we'll add the element after file selection
        
      default:
        return;
    }
    
    setCanvasElements([...canvasElements, newElement]);
    setSelectedElement(newElement);
  };

  // Update element properties
  const updateElement = (property, value) => {
    if (!selectedElement) return;
    
    const updatedElements = canvasElements.map(el => {
      if (el.id === selectedElement.id) {
        return {
          ...el,
          [property]: value
        };
      }
      return el;
    });
    
    setCanvasElements(updatedElements);
    
    // Update selected element reference
    const updatedElement = updatedElements.find(el => el.id === selectedElement.id);
    setSelectedElement(updatedElement);
  };

  // Delete selected element
  const deleteElement = () => {
    if (!selectedElement || selectedElement.isBackground) return;
    
    const updatedElements = canvasElements.filter(el => el.id !== selectedElement.id);
    setCanvasElements(updatedElements);
    setSelectedElement(null);
  };

  // Change background
  const changeBackground = (backgroundId) => {
    const background = backgrounds.find(bg => bg.id === backgroundId);
    if (!background) return;
    
    const updatedElements = canvasElements.map(el => {
      if (el.isBackground) {
        return {
          ...el,
          fill: background.preview
        };
      }
      return el;
    });
    
    setCanvasElements(updatedElements);
  };

  // Save template
  const handleSave = async () => {
    if (!serverId) {
      alert('Please select a server first');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Convert canvas to image for preview
      const canvas = canvasRef.current;
      const previewUrl = canvas.toDataURL('image/png');
      
      const templateData = {
        category,
        style: selectedTemplate,
        canvasElements,
        previewUrl
      };

      const response = type === 'slots'
        ? await visualService.saveSlotTemplate(serverId, templateData)
        : await visualService.saveLeaderboardTemplate(serverId, templateData);
      
      setSuccessMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} template saved successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(`Failed to save ${type} template:`, err);
      setError(`Failed to save: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`canvas-visual-editor canvas-visual-editor-${type}`}>
      <h3>Canvas Visual Editor: {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="editor-grid">
        <div className="editor-controls">
          <div className="control-group">
            <label>Category:</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Background:</label>
            <div className="background-options">
              {backgrounds.map(bg => (
                <div 
                  key={bg.id}
                  className="background-option"
                  style={{ background: bg.preview }}
                  onClick={() => changeBackground(bg.id)}
                  title={bg.name}
                />
              ))}
            </div>
          </div>
          
          <div className="control-group">
            <label>Add Elements:</label>
            <div className="element-buttons">
              <button onClick={() => addElement('text')} disabled={loading}>Add Text</button>
              <button onClick={() => addElement('rectangle')} disabled={loading}>Add Shape</button>
              <button onClick={() => addElement('image')} disabled={loading}>Add Image</button>
            </div>
          </div>
          
          {selectedElement && (
            <div className="element-properties">
              <h4>Element Properties</h4>
              
              {selectedElement.type === 'text' && (
                <>
                  <div className="property">
                    <label>Text:</label>
                    <input 
                      type="text" 
                      value={selectedElement.text} 
                      onChange={(e) => updateElement('text', e.target.value)}
                    />
                  </div>
                  
                  <div className="property">
                    <label>Font Size:</label>
                    <select
                      value={selectedElement.font.split('px')[0]}
                      onChange={(e) => updateElement('font', `${e.target.value}px Arial`)}
                    >
                      {[12, 14, 16, 18, 20, 24, 30, 36, 48].map(size => (
                        <option key={size} value={size}>{size}px</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="property">
                    <label>Color:</label>
                    <input 
                      type="color" 
                      value={selectedElement.fill} 
                      onChange={(e) => updateElement('fill', e.target.value)}
                    />
                  </div>
                  
                  <div className="property">
                    <label>Alignment:</label>
                    <select
                      value={selectedElement.textAlign}
                      onChange={(e) => updateElement('textAlign', e.target.value)}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </>
              )}
              
              {selectedElement.type === 'rectangle' && (
                <>
                  <div className="property">
                    <label>Fill Color:</label>
                    <input 
                      type="color" 
                      value={selectedElement.fill} 
                      onChange={(e) => updateElement('fill', e.target.value)}
                    />
                  </div>
                  
                  <div className="property">
                    <label>Border Color:</label>
                    <input 
                      type="color" 
                      value={selectedElement.stroke || '#ffffff'} 
                      onChange={(e) => updateElement('stroke', e.target.value)}
                    />
                  </div>
                  
                  <div className="property">
                    <label>Width:</label>
                    <input 
                      type="number" 
                      value={selectedElement.width} 
                      onChange={(e) => updateElement('width', parseInt(e.target.value))}
                      min="10"
                      max="800"
                    />
                  </div>
                  
                  <div className="property">
                    <label>Height:</label>
                    <input 
                      type="number" 
                      value={selectedElement.height} 
                      onChange={(e) => updateElement('height', parseInt(e.target.value))}
                      min="10"
                      max="400"
                    />
                  </div>
                </>
              )}
              
              {selectedElement.type === 'image' && (
                <>
                  <div className="property">
                    <label>Width:</label>
                    <input 
                      type="number" 
                      value={selectedElement.width} 
                      onChange={(e) => updateElement('width', parseInt(e.target.value))}
                      min="10"
                      max="800"
                    />
                  </div>
                  
                  <div className="property">
                    <label>Height:</label>
                    <input 
                      type="number" 
                      value={selectedElement.height} 
                      onChange={(e) => updateElement('height', parseInt(e.target.value))}
                      min="10"
                      max="400"
                    />
                  </div>
                  
                  <div className="property">
                    <button onClick={() => addElement('image')}>Change Image</button>
                  </div>
                </>
              )}
              
              <div className="property">
                <button 
                  className="delete-button" 
                  onClick={deleteElement}
                  disabled={selectedElement.isBackground}
                >
                  Delete Element
                </button>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="save-button"
          >
            {loading ? 'Saving...' : `Save ${type.charAt(0).toUpperCase() + type.slice(1)} Template`}
          </button>
        </div>

        <div className="canvas-container">
          <canvas 
            ref={canvasRef} 
            width="800" 
            height="400"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          />
          <div className="canvas-instructions">
            <p>Click and drag elements to position them. Select an element to edit its properties.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .editor-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        
        .control-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        select, input, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        .background-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }
        
        .background-option {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
        }
        
        .background-option:hover {
          border-color: #7289da;
        }
        
        .element-buttons {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        
        .element-buttons button {
          flex: 1;
          padding: 8px;
          background-color: #7289da;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .element-properties {
          margin-top: 20px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .property {
          margin-bottom: 10px;
        }
        
        .delete-button {
          width: 100%;
          padding: 8px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        
        .delete-button:disabled {
          background-color: #e57373;
          cursor: not-allowed;
        }
        
        .canvas-container {
          position: relative;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          background-color: #f0f0f0;
        }
        
        canvas {
          display: block;
          background-color: #fff;
          cursor: pointer;
        }
        
        .canvas-instructions {
          padding: 10px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          font-size: 12px;
          text-align: center;
        }
        
        .save-button {
          background-color: #7289da;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 20px;
          width: 100%;
        }
        
        .save-button:disabled {
          background-color: #a5b1e3;
          cursor: not-allowed;
        }
        
        .error-message {
          color: red;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #ffeeee;
          border: 1px solid #ffcccc;
          border-radius: 4px;
        }
        
        .success-message {
          color: green;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #eeffee;
          border: 1px solid #ccffcc;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
};

export default CanvasVisualEditor;