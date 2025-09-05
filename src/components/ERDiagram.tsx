import React, { useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Node, 
  Edge, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  ConnectionMode,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Database, Key, Link } from 'lucide-react';

interface TableSchema {
  tableName: string;
  columns: {
    name: string;
    type: string;
    description?: string;
  }[];
  sampleData: Record<string, any>[];
}

interface ERDiagramProps {
  tables: TableSchema[];
}

// Custom Table Node Component
const TableNode = ({ data }: { data: any }) => {
  const { table } = data;
  
  const getPrimaryKeys = (columns: any[]) => {
    return columns.filter(col => 
      col.name.toLowerCase() === 'id' || 
      col.description?.toLowerCase().includes('unique') ||
      col.description?.toLowerCase().includes('identifier')
    );
  };

  const getForeignKeys = (columns: any[]) => {
    return columns.filter(col => 
      col.name.includes('_id') || 
      col.description?.toLowerCase().includes('foreign key')
    );
  };

  const getDataType = (type: string) => {
    return type.split('(')[0]; // Extract base type from VARCHAR(100) etc.
  };

  const primaryKeys = getPrimaryKeys(table.columns);
  const foreignKeys = getForeignKeys(table.columns);

  return (
    <div className="bg-card border-2 border-primary/20 rounded-lg shadow-lg w-56">
      {/* Table Header */}
      <div className="bg-primary text-primary-foreground px-2.5 py-1.5 rounded-t-lg">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5" />
          <span className="font-semibold text-xs">{table.tableName}</span>
        </div>
      </div>
      
      {/* Columns */}
      <div className="divide-y divide-border">
        {table.columns.map((column: any, index: number) => {
          const isPrimaryKey = primaryKeys.some(pk => pk.name === column.name);
          const isForeignKey = foreignKeys.some(fk => fk.name === column.name);
          
          return (
            <div key={index} className="px-2.5 py-1 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  {isPrimaryKey && <Key className="w-2.5 h-2.5 text-yellow-600 flex-shrink-0" />}
                  {isForeignKey && <Link className="w-2.5 h-2.5 text-blue-600 flex-shrink-0" />}
                  <code className="font-mono text-xs font-medium truncate">{column.name}</code>
                </div>
                <div className="text-xs text-muted-foreground ml-1 flex-shrink-0">
                  {getDataType(column.type)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Row count */}
      <div className="px-2.5 py-1 bg-muted/30 rounded-b-lg text-xs text-muted-foreground">
        {table.sampleData.length} rows
      </div>
    </div>
  );
};

const nodeTypes = {
  table: TableNode,
};

const ERDiagram: React.FC<ERDiagramProps> = ({ tables }) => {
  // Generate nodes and edges from table data
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Create nodes for each table with improved positioning
    const tableCount = tables.length;
    const cols = Math.min(6, Math.ceil(Math.sqrt(tableCount * 1.3))); // Max 6 columns for larger grid
    const rows = Math.ceil(tableCount / cols);

    tables.forEach((table, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      nodes.push({
        id: table.tableName,
        type: 'table',
        position: { 
          x: col * 240 + 15, 
          y: row * 180 + 15 
        },
        data: { table },
        draggable: true,
      });
    });

    // Create edges based on foreign key relationships
    tables.forEach((table) => {
      table.columns.forEach((column) => {
        // Check if this column is a foreign key
        if (column.name.includes('_id') || column.description?.toLowerCase().includes('foreign key')) {
          // Try to find the referenced table
          let referencedTable = '';
          
          // Map common foreign key patterns
          const fkMappings: Record<string, string> = {
            'customer_id': 'customers',
            'product_id': 'products', 
            'order_id': 'orders',
            'category_id': 'categories',
            'supplier_id': 'suppliers',
            'warehouse_id': 'warehouses',
            'manager_id': 'employees',
            'department_id': 'departments',
            'coupon_id': 'coupons',
            'processed_by': 'employees',
            'changed_by': 'employees',
            'tag_id': 'tags',
            'wishlist_id': 'wishlists',
            'cart_id': 'shopping_carts',
            'plan_id': 'subscription_plans',
            'assigned_to': 'employees',
            'from_currency_id': 'currencies',
            'to_currency_id': 'currencies',
            'payment_method_id': 'payments'
          };

          referencedTable = fkMappings[column.name] || '';
          
          // Alternative: parse from description
          if (!referencedTable && column.description) {
            const match = column.description.match(/foreign key to (\w+) table/i);
            if (match) {
              referencedTable = match[1];
            }
          }

          // Create edge if referenced table exists
          if (referencedTable && tables.some(t => t.tableName === referencedTable)) {
            const edgeId = `${table.tableName}-${referencedTable}-${column.name}`;
            
            // Avoid duplicate edges
            if (!edges.some(edge => edge.id === edgeId)) {
              edges.push({
                id: edgeId,
                source: referencedTable,
                target: table.tableName,
                type: 'smoothstep',
                animated: false,
                style: { stroke: '#6366f1', strokeWidth: 2 },
                markerEnd: {
                  type: 'arrowclosed',
                  color: '#6366f1',
                  width: 20,
                  height: 20
                },
                label: column.name,
                labelStyle: { 
                  fontSize: '11px', 
                  fontWeight: 500,
                  fill: '#6366f1',
                  background: '#ffffff',
                  padding: '2px 4px',
                  borderRadius: '3px'
                },
              });
            }
          }
        }
      });
    });

    return { nodes, edges };
  }, [tables]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => {
    // Prevent manual connections
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="w-5 h-5" />
          Entity Relationship Diagram
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="h-full w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            fitViewOptions={{ padding: 0.02, minZoom: 0.15, maxZoom: 0.8 }}
            minZoom={0.1}
            maxZoom={1.0}
            defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}
          >
            <Background />
            <Controls showInteractive={false} />
            <Panel position="bottom-left" className="bg-card border border-border rounded-lg p-3 text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Key className="w-3 h-3 text-yellow-600" />
                  <span>Primary Key</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link className="w-3 h-3 text-blue-600" />
                  <span>Foreign Key</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-indigo-500"></div>
                  <span>Relationship</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
};

export default ERDiagram;