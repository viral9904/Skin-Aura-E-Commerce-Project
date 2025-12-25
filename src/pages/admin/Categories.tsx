
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

// Types
type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

// Mock categories data
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Face Serum',
    slug: 'face-serum',
    description: 'Concentrated formulations with active ingredients for specific skin concerns.',
    productCount: 15
  },
  {
    id: '2',
    name: 'Face Wash',
    slug: 'face-wash',
    description: 'Cleansers designed to remove dirt, oil, and impurities from the skin.',
    productCount: 12
  },
  {
    id: '3',
    name: 'Sun Screen',
    slug: 'sun-screen',
    description: 'Products providing protection against harmful UVA and UVB rays.',
    productCount: 8
  }
];

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const { toast } = useToast();

  // For category form
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
  });

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Auto-generate slug from name
    if (name === 'name') {
      setFormData({
        ...formData,
        name: value,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      });
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({ ...category });
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(category => category.id !== categoryId));
    toast({
      title: "Category Deleted",
      description: "The category has been deleted successfully."
    });
  };

  const handleSaveCategory = () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(category => 
        category.id === editingCategory.id 
          ? { ...category, ...formData, productCount: category.productCount } as Category 
          : category
      ));
      toast({
        title: "Category Updated",
        description: "The category has been updated successfully."
      });
    } else {
      // Add new category
      const newCategory: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || 'New Category',
        slug: formData.slug || 'new-category',
        description: formData.description || '',
        productCount: 0
      };
      
      setCategories([...categories, newCategory]);
      toast({
        title: "Category Added",
        description: "The new category has been added successfully."
      });
    }
    resetForm();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        
        <Dialog onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={handleSaveCategory}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">
                  {category.name}
                </TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>
                  <div className="truncate max-w-[300px]">
                    {category.description}
                  </div>
                </TableCell>
                <TableCell className="text-right">{category.productCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Dialog onOpenChange={(open) => !open && resetForm()}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Edit Category</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="slug" className="text-right">Slug</Label>
                            <Input
                              id="slug"
                              name="slug"
                              value={formData.slug}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Input
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit" onClick={handleSaveCategory}>Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCategories;
