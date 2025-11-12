'use client';
import { faker } from '@faker-js/faker';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider } from '@/components/ui/kanban';
import { Button } from '@/components/ui/button';
import { Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from '@/components/ui/select';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const initialColumns = [
  { id: faker.string.uuid(), name: 'Backlog', color: '#6B7280' },
  { id: faker.string.uuid(), name: 'In Progress', color: '#F59E0B' },
  { id: faker.string.uuid(), name: 'Done', color: '#10B981' },
];
const users = Array.from({ length: 4 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
  }));
const exampleFeatures = Array.from({ length: 20 })
  .fill(null)
  .map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.company.buzzPhrase()),
    startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
    endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
    column: faker.helpers.arrayElement(initialColumns).id,
    owner: faker.helpers.arrayElement(users),
  }));
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const Kanban = () => {
  const [features, setFeatures] = useState(exampleFeatures);
  const [columns, setColumns] = useState(initialColumns);

  const handleAddTask = (taskName: string, columnName: string) => {
    const newFeature = {
      id: faker.string.uuid(),
      name: taskName,
      startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
      endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
      column: columnName,
      owner: faker.helpers.arrayElement(users),
    };
    setFeatures((prev) => [...prev, newFeature]);
  };

  const handleAddColumn = (columnName: string) => {
    const newColumn = {
      id: faker.string.uuid(),
      name: columnName,
      color: faker.internet.color(),
    };
    setColumns((prev) => [...prev, newColumn]);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-end gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Añadir Tarea</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nueva Tarea</DialogTitle>
            </DialogHeader>
            {/* Formulario para añadir tarea */}
            <AddTaskForm onSubmit={handleAddTask} columns={columns} />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Añadir Columna</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nueva Columna</DialogTitle>
            </DialogHeader>
            {/* Formulario para añadir columna */}
            <AddColumnForm onSubmit={handleAddColumn} />
          </DialogContent>
        </Dialog>
      </div>
      <KanbanProvider
        columns={columns}
        onColumnsChange={setColumns}
        data={features}
        onDataChange={setFeatures}
      >
        {(column: any) => (
          <KanbanBoard id={column.id} key={column.id}>
            <KanbanHeader>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <span>{column.name}</span>
              </div>
            </KanbanHeader>
            <KanbanCards id={column.id}>
              {(feature: (typeof features)[number]) => (
                <KanbanCard
                  column={column.id}
                  id={feature.id}
                  key={feature.id}
                  name={feature.name}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <p className="m-0 flex-1 font-medium text-sm">
                        {feature.name}
                      </p>
                    </div>
                    {feature.owner && (
                      <Avatar className="h-4 w-4 shrink-0">
                        <AvatarImage src={feature.owner.image} />
                        <AvatarFallback>
                          {feature.owner.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <p className="m-0 text-muted-foreground text-xs">
                    {shortDateFormatter.format(feature.startAt)} -{' '}
                    {dateFormatter.format(feature.endAt)}
                  </p>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
};

interface AddTaskFormProps {
  onSubmit: (taskName: string, columnName: string) => void;
  columns: typeof initialColumns;
}

const AddTaskForm = ({ onSubmit, columns }: AddTaskFormProps) => {
  const [taskName, setTaskName] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(columns[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim() && selectedColumn) {
      onSubmit(taskName, selectedColumn);
      setTaskName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="taskName">Nombre de la Tarea</Label>
        <Input
          id="taskName"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="column">Columna</Label>
        <Select onValueChange={setSelectedColumn} value={selectedColumn}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una columna" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column.id} value={column.id}>
                {column.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Añadir Tarea</Button>
    </form>
  );
};

interface AddColumnFormProps {
  onSubmit: (columnName: string) => void;
}

const AddColumnForm = ({ onSubmit }: AddColumnFormProps) => {
  const [columnName, setColumnName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (columnName.trim()) {
      onSubmit(columnName);
      setColumnName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="columnName">Nombre de la Columna</Label>
        <Input
          id="columnName"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Añadir Columna</Button>
    </form>
  );
};

export default Kanban;
