import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bot,
  Cpu,
  Database,
  FileText,
  Info,
  LineChart,
  Network,
  Package,
  Search,
  Target,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";

interface ModelDocsViewerProps {
  modelDetails: any;
  textFiles: Array<{ name: string; content: string }>;
}

const IconMap = {
  Bot,
  Network,
  Database,
  LineChart,
  Target,
  Search,
  BarChart,
  XCircle,
  Cpu,
  Package,
  Info,
};

const MetricCard = ({ metric, value, icon }: any) => {
  const Icon = IconMap[icon as keyof typeof IconMap] || Info;
  const percentage = typeof value === "number" ? value * 100 : 0;

  return (
    <div className="p-6 border border-gray-800 rounded-lmid bg-black hover:border-green-300/20 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-300 text-sm font-light">{metric}</h3>
        <Icon className="h-4 w-4 text-gray-300 opacity-75" />
      </div>
      <div className="text-2xl font-light text-white mb-2">
        {typeof value === "number" ? value.toFixed(3) : value}
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1">
        <div
          className="bg-green-300 h-1 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const JsonView = ({ data }: { data: any }) => {
  const renderSection = (section: any, title: string) => {
    const Icon = section.ui?.icon
      ? IconMap[section.ui.icon as keyof typeof IconMap]
      : Info;

    if (section.metrics) {
      return (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
            {title && (
              <>
                {" "}
                <Icon className="h-5 w-5 text-green-300" />
                <h2 className="text-white text-xl font-light">{title}</h2>
              </>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(section.metrics).map(
              ([key, value]: [string, any]) => (
                <MetricCard
                  key={key}
                  metric={key}
                  value={value.value}
                  status={value.status}
                  icon={value.ui?.icon}
                />
              )
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
          {title && (
            <>
              <Icon className="h-5 w-5 text-green-300" />
              <h2 className="text-white text-xl font-light">{title}</h2>
            </>
          )}
        </div>
        <div className="space-y-4">
          {Object.entries(section).map(([key, value]) => {
            if (key === "ui") return null;
            if (typeof value === "object" && value !== null) {
              // @ts-ignore
              const NestedIcon = value.ui?.icon
                ? //   @ts-ignore
                  IconMap[value.ui.icon as keyof typeof IconMap]
                : Info;
              return (
                <div key={key} className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <NestedIcon className="h-4 w-4 text-green-300" />
                    <h4 className="text-gray-300 font-light capitalize">
                      {key}
                    </h4>
                  </div>
                  <div className="pl-4">{renderSection(value, "")}</div>
                </div>
              );
            }
            return (
              <div key={key} className="flex items-center gap-2 text-gray-300">
                <span className="font-light capitalize">{key}:</span>
                <span className="text-white">
                  {Array.isArray(value) ? value.join(", ") : String(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <ScrollArea className="h-[600px]">
      <div className="p-6 space-y-8">
        {Object.entries(data).map(([key, value]: [string, any]) =>
          renderSection(value, key)
        )}
      </div>
    </ScrollArea>
  );
};

const TextFileView = ({
  files,
}: {
  files: Array<{ name: string; content: string }>;
}) => {
  const [selectedFile, setSelectedFile] = useState<string>(files[0]?.name);

  return (
    <div className="p-6 flex gap-6">
      <div className="w-1/4 space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            onClick={() => setSelectedFile(file.name)}
            className={`p-3 rounded-lmid cursor-pointer flex items-center gap-2 transition-colors
              ${
                selectedFile === file.name
                  ? "bg-green-300 text-white"
                  : "text-gray-300 border border-gray-800 hover:border-green-300/20"
              }`}
          >
            <FileText className="h-4 w-4" />
            <span className="font-light">{file.name}</span>
          </div>
        ))}
      </div>
      <div className="w-3/4">
        <ScrollArea className="h-[600px] w-full rounded-lmid border border-gray-800 bg-black p-6">
          {selectedFile ? (
            <pre className="font-mono text-sm text-gray-300">
              {files.find((f) => f.name === selectedFile)?.content}
            </pre>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              Select a file to view its contents
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export const ModelDocsViewer: React.FC<ModelDocsViewerProps> = ({
  modelDetails,
  textFiles,
}) => {
  return (
    <div className="w-full bg-black rounded-lmid border border-gray-800">
      <Tabs defaultValue="model" className="w-full">
        <TabsList className="flex w-full border-b border-gray-800 bg-transparent">
          <TabsTrigger
            value="model"
            className="flex-1 p-4 text-gray-300 bg-transparent hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-300 data-[state=active]:bg-transparent"
          >
            <Bot className="h-4 w-4 mr-2" />
            Model Details
          </TabsTrigger>
          <TabsTrigger
            value="data"
            className="flex-1 p-4 text-gray-300 bg-transparent hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-green-300 data-[state=active]:bg-transparent"
          >
            <FileText className="h-4 w-4 mr-2" />
            Training Data
          </TabsTrigger>
        </TabsList>
        <TabsContent value="model">
          <JsonView data={modelDetails} />
        </TabsContent>
        <TabsContent value="data">
          <TextFileView files={textFiles} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelDocsViewer;
