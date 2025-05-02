import React, { useState, useEffect } from 'react';
import { visualService } from '../services/api';

const VisualEditor = ({ type, serverId }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('style_a');
  const [category, setCategory] = useState(type === 'slots' ? 'scrim' : 'top_10');
  const [customization, setCustomization] = useState({
    fontColor: '#ffffff',
    backgroundColor: '#121212',
    borderColor: '#7289da',
    logoUrl: '',
    customText: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
          setCustomization(data.savedTemplate.customization);
        }
        // Generate preview
        if (data.previewUrl) {
          setPreviewUrl(data.previewUrl);
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

  const handleSave = async () => {
    if (!serverId) {
      alert('Please select a server first');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const templateData = {
        category,
        style: selectedTemplate,
        customization
      };

      const response = type === 'slots'
        ? await visualService.saveSlotTemplate(serverId, templateData)
        : await visualService.saveLeaderboardTemplate(serverId, templateData);

      if (response.previewUrl) {
        setPreviewUrl(response.previewUrl);
      }
      
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} template saved successfully!`);
    } catch (err) {
      console.error(`Failed to save ${type} template:`, err);
      setError(`Failed to save: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // For demo purposes, create a local URL
    // In production, you would upload to server
    const localUrl = URL.createObjectURL(file);
    setCustomization({
      ...customization,
      logoUrl: localUrl
    });
  };

  return (
    <section className={`visual-editor visual-editor-${type}`}>
      <h3>Visual Editor: {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
      
      {error && <div className="error-message">{error}</div>}
      
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
            <label>Template Style:</label>
            <select 
              value={selectedTemplate} 
              onChange={(e) => setSelectedTemplate(e.target.value)}
              disabled={loading}
            >
              <option value="style_a">Style A</option>
              <option value="style_b">Style B</option>
            </select>
          </div>

          <div className="control-group">
            <label>Font Color:</label>
            <input 
              type="color" 
              value={customization.fontColor} 
              onChange={(e) => setCustomization({...customization, fontColor: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="control-group">
            <label>Background Color:</label>
            <input 
              type="color" 
              value={customization.backgroundColor} 
              onChange={(e) => setCustomization({...customization, backgroundColor: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="control-group">
            <label>Border Color:</label>
            <input 
              type="color" 
              value={customization.borderColor} 
              onChange={(e) => setCustomization({...customization, borderColor: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="control-group">
            <label>Custom Logo:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              disabled={loading}
            />
            {customization.logoUrl && (
              <div className="logo-preview">
                <img 
                  src={customization.logoUrl} 
                  alt="Logo Preview" 
                  style={{ maxWidth: '100px', maxHeight: '100px' }} 
                />
              </div>
            )}
          </div>

          <div className="control-group">
            <label>Custom Text:</label>
            <textarea
              value={customization.customText}
              onChange={(e) => setCustomization({...customization, customText: e.target.value})}
              placeholder={`Custom text for ${type}`}
              rows={3}
              disabled={loading}
            />
          </div>

          <button 
            onClick={handleSave} 
            disabled={loading}
            className="save-button"
          >
            {loading ? 'Saving...' : `Save ${type.charAt(0).toUpperCase() + type.slice(1)} Configuration`}
          </button>
        </div>

        <div className="preview-area">
          <h4>Preview</h4>
          {previewUrl ? (
            <img src={previewUrl} alt={`${type} preview`} style={{ maxWidth: '100%' }} />
          ) : (
            <div className="preview-placeholder">
              <p>Preview will appear here after saving</p>
              <div 
                className="preview-mock" 
                style={{
                  backgroundColor: customization.backgroundColor,
                  color: customization.fontColor,
                  border: `2px solid ${customization.borderColor}`,
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <p>Sample {type} preview with your colors</p>
                {customization.customText && <p>{customization.customText}</p>}
                {customization.logoUrl && (
                  <img 
                    src={customization.logoUrl} 
                    alt="Logo" 
                    style={{ maxWidth: '50px', maxHeight: '50px', margin: '10px auto' }} 
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .editor-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
        
        .save-button {
          background-color: #7289da;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-top: 10px;
        }
        
        .save-button:disabled {
          background-color: #a5b1e3;
          cursor: not-allowed;
        }
        
        .preview-area {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          background-color: #f9f9f9;
        }
        
        .preview-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }
        
        .error-message {
          color: red;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #ffeeee;
          border: 1px solid #ffcccc;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
};

export default VisualEditor;