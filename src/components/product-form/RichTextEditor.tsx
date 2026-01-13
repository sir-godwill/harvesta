import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Table,
  Heading1,
  Heading2,
  Quote,
  Code,
  Undo,
  Redo,
  Leaf,
  Thermometer,
  Award,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  showAgroTemplates?: boolean;
}

const toolbarGroups = [
  {
    name: 'history',
    tools: [
      { icon: Undo, label: 'Undo', command: 'undo' },
      { icon: Redo, label: 'Redo', command: 'redo' },
    ],
  },
  {
    name: 'headings',
    tools: [
      { icon: Heading1, label: 'Heading 1', command: 'h1' },
      { icon: Heading2, label: 'Heading 2', command: 'h2' },
    ],
  },
  {
    name: 'formatting',
    tools: [
      { icon: Bold, label: 'Bold', command: 'bold' },
      { icon: Italic, label: 'Italic', command: 'italic' },
      { icon: Underline, label: 'Underline', command: 'underline' },
    ],
  },
  {
    name: 'lists',
    tools: [
      { icon: List, label: 'Bullet List', command: 'ul' },
      { icon: ListOrdered, label: 'Numbered List', command: 'ol' },
    ],
  },
  {
    name: 'alignment',
    tools: [
      { icon: AlignLeft, label: 'Align Left', command: 'alignLeft' },
      { icon: AlignCenter, label: 'Align Center', command: 'alignCenter' },
      { icon: AlignRight, label: 'Align Right', command: 'alignRight' },
    ],
  },
  {
    name: 'blocks',
    tools: [
      { icon: Quote, label: 'Quote', command: 'quote' },
      { icon: Code, label: 'Code', command: 'code' },
    ],
  },
  {
    name: 'insert',
    tools: [
      { icon: Link, label: 'Link', command: 'link' },
      { icon: Image, label: 'Image', command: 'image' },
      { icon: Table, label: 'Table', command: 'table' },
    ],
  },
];

const agroTemplates = [
  {
    icon: Leaf,
    label: 'Farming Tips',
    content: `<h2>🌱 Farming Tips</h2>
<ul>
<li>Best growing conditions: [describe soil, climate, etc.]</li>
<li>Recommended planting season: [months]</li>
<li>Water requirements: [frequency and amount]</li>
<li>Pest prevention: [common pests and solutions]</li>
</ul>`,
  },
  {
    icon: Thermometer,
    label: 'Storage Instructions',
    content: `<h2>📦 Storage Instructions</h2>
<ul>
<li>Temperature: [recommended range]°C</li>
<li>Humidity: [percentage]%</li>
<li>Shelf life: [duration]</li>
<li>Special handling: [any specific requirements]</li>
</ul>`,
  },
  {
    icon: Award,
    label: 'Certifications',
    content: `<h2>🏅 Certifications & Quality</h2>
<ul>
<li>Organic certification: [Yes/No - details]</li>
<li>Export quality: [grade/standard]</li>
<li>Testing results: [lab results if available]</li>
<li>Compliance: [relevant standards]</li>
</ul>`,
  },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your product description here...',
  minHeight = '300px',
  showAgroTemplates = true,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const executeCommand = (command: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    
    switch (command) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'ul':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'ol':
        document.execCommand('insertOrderedList', false);
        break;
      case 'alignLeft':
        document.execCommand('justifyLeft', false);
        break;
      case 'alignCenter':
        document.execCommand('justifyCenter', false);
        break;
      case 'alignRight':
        document.execCommand('justifyRight', false);
        break;
      case 'h1':
        document.execCommand('formatBlock', false, 'h1');
        break;
      case 'h2':
        document.execCommand('formatBlock', false, 'h2');
        break;
      case 'quote':
        document.execCommand('formatBlock', false, 'blockquote');
        break;
      case 'code':
        document.execCommand('formatBlock', false, 'pre');
        break;
      case 'undo':
        document.execCommand('undo', false);
        break;
      case 'redo':
        document.execCommand('redo', false);
        break;
      case 'link':
        setShowLinkInput(true);
        break;
      case 'table':
        insertTable();
        break;
    }

    // Update value after command
    setTimeout(() => {
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }, 10);
  };

  const insertLink = () => {
    if (linkUrl) {
      document.execCommand('createLink', false, linkUrl);
      setLinkUrl('');
      setShowLinkInput(false);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  const insertTable = () => {
    const table = `
      <table border="1" style="width:100%; border-collapse: collapse; margin: 16px 0;">
        <thead>
          <tr>
            <th style="padding: 8px; background: #f3f4f6;">Column 1</th>
            <th style="padding: 8px; background: #f3f4f6;">Column 2</th>
            <th style="padding: 8px; background: #f3f4f6;">Column 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px;">Data 1</td>
            <td style="padding: 8px;">Data 2</td>
            <td style="padding: 8px;">Data 3</td>
          </tr>
        </tbody>
      </table>
    `;
    document.execCommand('insertHTML', false, table);
  };

  const insertTemplate = (content: string) => {
    const editor = editorRef.current;
    if (editor) {
      editor.focus();
      document.execCommand('insertHTML', false, content);
      onChange(editor.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 border-b">
        <TooltipProvider delayDuration={300}>
          {toolbarGroups.map((group, groupIndex) => (
            <div key={group.name} className="flex items-center">
              {groupIndex > 0 && <Separator orientation="vertical" className="h-6 mx-1" />}
              {group.tools.map((tool) => (
                <Tooltip key={tool.command}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => executeCommand(tool.command)}
                    >
                      <tool.icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{tool.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}

          {/* Agro Templates */}
          {showAgroTemplates && (
            <>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <span className="text-xs hidden sm:inline">Agro Templates</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="end">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Quick Insert Templates
                    </p>
                    {agroTemplates.map((template) => (
                      <Button
                        key={template.label}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => insertTemplate(template.content)}
                      >
                        <template.icon className="h-4 w-4 text-green-600" />
                        {template.label}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </TooltipProvider>
      </div>

      {/* Link Input Popover */}
      <AnimatePresence>
        {showLinkInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-2 bg-muted/50 border-b"
          >
            <Label className="text-sm">URL:</Label>
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 h-8"
              onKeyDown={(e) => e.key === 'Enter' && insertLink()}
            />
            <Button size="sm" onClick={insertLink}>Insert</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowLinkInput(false)}>Cancel</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className={cn(
          "p-4 outline-none prose prose-sm max-w-none",
          "focus:ring-2 focus:ring-primary/20",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4",
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4",
          "[&_li]:mb-1",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:italic",
          "[&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:text-sm",
          "[&_table]:w-full [&_table]:border-collapse",
          "[&_th]:bg-muted [&_th]:p-2 [&_th]:border [&_th]:border-border",
          "[&_td]:p-2 [&_td]:border [&_td]:border-border",
          "[&_a]:text-primary [&_a]:underline"
        )}
        style={{ minHeight }}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        data-placeholder={placeholder}
      />

      {/* Helper Text */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/20 border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <HelpCircle className="h-3 w-3" />
          <span>Tip: Use templates above to add farming tips, storage info, or certifications</span>
        </div>
        <span>{value ? value.replace(/<[^>]*>/g, '').length : 0} characters</span>
      </div>
    </div>
  );
}
