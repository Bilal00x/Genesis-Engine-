"""
Editor Page
"""

import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Connection,
  Edge,
  ReactFlowProvider,
  NodeChange,
  EdgeChange,
  ConnectionLineType,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "react-flow-renderer";

// Define node types
const nodeTypes = {
  prompt: ({ data }: { data: any }) => (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-xs font-bold">P</span>
        </div>
        <h3 className="text-sm font-medium">Prompt</h3>
      </div>
      <p className="text-xs text-muted-foreground">Enter your prompt</p>
      <textarea
        className="w-full mt-2 rounded border p-2 text-xs bg-background text-text"
        placeholder="A futuristic cityscape..."
        defaultValue={data?.prompt || ""}
      />
    </div>
  ),
  
  imageGen: ({ data }: { data: any }) => (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center">
          <span className="text-secondary text-xs font-bold">I</span>
        </div>
        <h3 className="text-sm font-medium">Image Generation</h3>
      </div>
      <p className="text-xs text-muted-foreground">Generate image from prompt</p>
      <div className="mt-2">
        <select className="w-full rounded border p-2 text-xs bg-background text-text">
          <option>Stable Diffusion</option>
          <option>Flux</option>
          <option>OpenAI</option>
        </select>
      </div>
    </div>
  ),
  
  upscale: ({ data }: { data: any }) => (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-accent text-xs font-bold">U</span>
        </div>
        <h3 className="text-sm font-medium">Upscale</h3>
      </div>
      <p className="text-xs text-muted-foreground">Increase resolution</p>
      <div className="mt-2">
        <select className="w-full rounded border p-2 text-xs bg-background text-text">
          <option>2x</option>
          <option>4x</option>
          <option>8x</option>
        </select>
      </div>
    </div>
  ),
  
  backgroundRemoval: ({ data }: { data: any }) => (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-xs font-bold">B</span>
        </div>
        <h3 className="text-sm font-medium">Background Removal</h3>
      </div>
      <p className="text-xs text-muted-foreground">Remove background</p>
    </div>
  ),
  
  "3dGen": ({ data }: { data: any }) => (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center">
          <span className="text-secondary text-xs font-bold">3D</span>
        </div>
        <h3 className="text-sm font-medium">3D Generation</h3>
      </div>
      <p className="text-xs text-muted-foreground">Convert to 3D model</p>
      <div className="mt-2">
        <select className="w-full rounded border p-2 text-xs bg-background text-text">
          <option>Meschy</option>
          <option>Tripo</option>
        </select>
      </div>
    </div>
  ),
  
  rigging: ({ data }: { data: any }) => (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-accent text-xs font-bold">R</span>
        </div>
        <h3 className="text-sm font-medium">Rigging</h3>
      </div>
      <p className="text-xs text-muted-foreground">Create skeleton</p>
    </div>
  ),
  
  animation: ({ data }: { data: any }) => (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-xs font-bold">A</span>
        </div>
        <h3 className="text-sm font-medium">Animation</h3>
      </div>
      <p className="text-xs text-muted-foreground">Generate motion</p>
    </div>
  ),
  
  export: ({ data }: { data: any }) => (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center">
          <span className="text-secondary text-xs font-bold">E</span>
        </div>
        <h3 className="text-sm font-medium">Export</h3>
      </div>
      <p className="text-xs text-muted-foreground">Export to game engine</p>
      <div className="mt-2">
        <select className="w-full rounded border p-2 text-xs bg-background text-text">
          <option>Unity</option>
          <option>Unreal</option>
          <option>Godot</option>
        </select>
      </div>
    </div>
  ),
};

export default function EditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      type: "prompt",
      position: { x: 100, y: 100 },
      data: { prompt: "A futuristic cityscape with flying cars" },
    },
    {
      id: "2",
      type: "imageGen",
      position: { x: 300, y: 100 },
      data: {},
    },
    {
      id: "3",
      type: "upscale",
      position: { x: 500, y: 100 },
      data: {},
    },
    {
      id: "4",
      type: "backgroundRemoval",
      position: { x: 700, y: 100 },
      data: {},
    },
    {
      id: "5",
      type: "3dGen",
      position: { x: 900, y: 100 },
      data: {},
    },
    {
      id: "6",
      type: "rigging",
      position: { x: 1100, y: 100 },
      data: {},
    },
    {
      id: "7",
      type: "animation",
      position: { x: 1300, y: 100 },
      data: {},
    },
    {
      id: "8",
      type: "export",
      position: { x: 1500, y: 100 },
      data: {},
    },
  ]);
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: "e1-2", source: "1", target: "2", type: "default" },
    { id: "e2-3", source: "2", target: "3", type: "default" },
    { id: "e3-4", source: "3", target: "4", type: "default" },
    { id: "e4-5", source: "4", target: "5", type: "default" },
    { id: "e5-6", source: "5", target: "6", type: "default" },
    { id: "e6-7", source: "6", target: "7", type: "default" },
    { id: "e7-8", source: "7", target: "8", type: "default" },
  ]);
  
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  const onConnect = (params: any) => setEdges((eds) => eds.concat(params));
  
  const onDragOver = (event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  
  const onDrop = (event: any) => {
    event.preventDefault();
    
    const reactFlowBounds = reactFlowInstance?.getBounds();
    const type = event.dataTransfer.getData("application/reactflow");
    
    // Check if the dropped element is a valid node type
    if (!type || !nodeTypes[type]) return;
    
    // Calculate position
    const position = reactFlowInstance?.screenToFlowPosition({
      x: event.clientX - reactFlowBounds?.left,
      y: event.clientY - reactFlowBounds?.top,
    });
    
    const newNode = {
      id: `${Date.now()}`,
      type,
      position,
      data: {},
    };
    
    setNodes((nds) => nds.concat(newNode));
  };
  
  useEffect(() => {
    const flow = document.getElementById("react-flow");
    if (flow) {
      flow.addEventListener("dragover", onDragOver);
      flow.addEventListener("drop", onDrop);
    }
    
    return () => {
      if (flow) {
        flow.removeEventListener("dragover", onDragOver);
        flow.removeEventListener("drop", onDrop);
      }
    };
  }, [reactFlowInstance]);
  
  return (
    <div className="h-screen bg-background text-text">
      <div className="flex h-full">
        <div className="w-64 bg-card border-r p-4">
          <h2 className="text-lg font-semibold mb-4">Nodes</h2>
          <div className="space-y-2">
            {Object.entries(nodeTypes).map(([key, _]) => (
              <div
                key={key}
                className="p-3 rounded border bg-card cursor-grab hover:bg-muted"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("application/reactflow", key);
                }}
              >
                <span className="font-medium">{key}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 relative" id="react-flow">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              connectionLineType={ConnectionLineType.SmoothStep}
              connectionMode={ConnectionMode.Loose}
              fitView
              minZoom={0.2}
              maxZoom={2}
              onInit={setReactFlowInstance}
              className="h-full"
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}