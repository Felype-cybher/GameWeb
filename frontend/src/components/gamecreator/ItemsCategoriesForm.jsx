import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const ItemsCategoriesForm = ({ itemsAndCategories, setItemsAndCategories }) => {
  const addCategory = () => {
    setItemsAndCategories(prev => ({
      ...prev,
      categories: [...prev.categories, '']
    }));
  };

  const removeCategory = (index) => {
    if (itemsAndCategories.categories.length > 1) {
      const updatedCategories = itemsAndCategories.categories.filter((_, i) => i !== index);
      const categoryName = itemsAndCategories.categories[index];
      const updatedItems = itemsAndCategories.items.map(item => 
        item.category === categoryName ? { ...item, category: '' } : item
      );
      setItemsAndCategories({ categories: updatedCategories, items: updatedItems });
    }
  };

  const updateCategory = (index, value) => {
    const updated = [...itemsAndCategories.categories];
    const oldCategory = updated[index];
    updated[index] = value;
    const updatedItems = itemsAndCategories.items.map(item =>
      item.category === oldCategory ? { ...item, category: value } : item
    );
    setItemsAndCategories({ categories: updated, items: updatedItems });
  };

  const addItem = () => {
    setItemsAndCategories(prev => ({
      ...prev,
      items: [...prev.items, { name: '', category: '' }]
    }));
  };

  const removeItem = (index) => {
    if (itemsAndCategories.items.length > 1) {
      setItemsAndCategories(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const updateItem = (index, field, value) => {
    const updated = [...itemsAndCategories.items];
    updated[index][field] = value;
    setItemsAndCategories(prev => ({ ...prev, items: updated }));
  };

  return (
    <div className="space-y-6 pt-4 border-t">
      {/* Categorias */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium text-gray-700">
            2. Categorias
          </h3>
          <Button
            onClick={addCategory}
            variant="outline"
            size="sm"
            className="text-purple-600 border-purple-300 hover:bg-purple-50 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar Categoria
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {itemsAndCategories.categories.map((category, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-2 bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">
                  Categoria {index + 1}
                </span>
                {itemsAndCategories.categories.length > 1 && (
                  <Button
                    onClick={() => removeCategory(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-100 p-1 h-auto"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <input
                type="text"
                value={category}
                onChange={(e) => updateCategory(index, e.target.value)}
                placeholder="Ex: Frutas"
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">Adicione pelo menos 2 categorias.</p>
      </div>

      {/* Itens */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium text-gray-700">
            3. Itens
          </h3>
          <Button
            onClick={addItem}
            variant="outline"
            size="sm"
            className="text-purple-600 border-purple-300 hover:bg-purple-50 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar Item
          </Button>
        </div>
        {itemsAndCategories.items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-3 space-y-2 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">
                Item {index + 1}
              </span>
              {itemsAndCategories.items.length > 1 && (
                <Button
                  onClick={() => removeItem(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-100 p-1 h-auto"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-0.5">
                  Nome do Item
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  placeholder="Ex: Maçã"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-0.5">
                  Categoria
                </label>
                <select
                  value={item.category}
                  onChange={(e) => updateItem(index, 'category', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white"
                >
                  <option value="">Selecione</option>
                  {itemsAndCategories.categories
                    .filter(cat => cat.trim())
                    .map((category, catIndex) => (
                      <option key={catIndex} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        ))}
        <p className="text-xs text-gray-500">Adicione pelo menos 2 itens e associe-os às categorias.</p>
      </div>
    </div>
  );
};

export default ItemsCategoriesForm;