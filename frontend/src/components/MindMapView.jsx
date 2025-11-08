import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { exportToText, exportToPDF } from '../utils/exportUtils';
import API_BASE_URL from '../utils/api';
import './ContentView.css';

const MindMapView = ({ documentId, content, onContentGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  useEffect(() => {
    if (content) {
      convertToFlowNodes(content);
    }
  }, [content]);

  const generateMindMap = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate/mindmap/${documentId}`);
      onContentGenerated(response.data.mindMap);
      toast.success('Mind map generated successfully!');
    } catch (error) {
      console.error('Error generating mind map:', error);
      toast.error('Failed to generate mind map');
    } finally {
      setLoading(false);
    }
  };

  const convertToFlowNodes = (data) => {
    const newNodes = [];
    const newEdges = [];
    let xOffset = 0;
    let yOffset = 0;

    const processNode = (node, parentId = null, level = 0, index = 0) => {
      const nodeId = node.id || `node-${Math.random()}`;
      
      // Calculate position
      const x = level * 300 + (index % 2) * 100;
      const y = index * 120;

      newNodes.push({
        id: nodeId,
        data: { label: node.label },
        position: { x, y },
        style: {
          background: level === 0 ? '#667eea' : level === 1 ? '#764ba2' : '#a78bfa',
          color: 'white',
          border: '2px solid #fff',
          borderRadius: '12px',
          padding: '12px 20px',
          fontSize: level === 0 ? '16px' : '14px',
          fontWeight: level === 0 ? 'bold' : 'normal',
        },
      });

      if (parentId) {
        newEdges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#667eea', strokeWidth: 2 },
        });
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child, i) => {
          processNode(child, nodeId, level + 1, i);
        });
      }
    };

    processNode(data);
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleExportText = () => {
    const text = JSON.stringify(content, null, 2);
    exportToText(text, 'mindmap.txt');
    toast.success('Exported as text file!');
  };

  const handleExportPDF = () => {
    const text = JSON.stringify(content, null, 2);
    exportToPDF('Mind Map', text, 'mindmap.pdf');
    toast.success('Exported as PDF!');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Generating your mind map with AI...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="empty-state">
        <p>No mind map generated yet.</p>
        <button className="generate-btn" onClick={generateMindMap}>
          Generate Mind Map
        </button>
      </div>
    );
  }

  return (
    <div className="content-view">
      <div className="content-header">
        <h2>🧠 Mind Map</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={handleExportText}>
            <FiDownload size={18} />
            <span>TXT</span>
          </button>
          <button className="action-btn" onClick={handleExportPDF}>
            <FiDownload size={18} />
            <span>PDF</span>
          </button>
        </div>
      </div>
      <div className="mindmap-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              return node.style?.background || '#667eea';
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default MindMapView;

