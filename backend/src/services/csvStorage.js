// services/csvStorage.js
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Papa = require('papaparse');
const config = require('../config/config');

class CsvStorage {
  constructor(fileName) {
    this.dataDir = path.join(__dirname, '..', 'data');
    this.filePath = path.join(this.dataDir, `${fileName}.csv`);
    this.initPromise = this.initialize();
  }

  async initialize() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(this.dataDir, { recursive: true });

      // Check if file exists, create it if not
      try {
        await fs.access(this.filePath);
      } catch (error) {
        // Create file with headers
        await fs.writeFile(this.filePath, this.getHeaders());
      }
    } catch (error) {
      console.error(`Error initializing CSV storage for ${this.filePath}:`, error);
      throw error;
    }
  }

  getHeaders() {
    return 'id,slug,name,reason,theme,useCustomTheme,customTheme,message,media,visits,isPublic,createdAt\n';
  }

  async waitForInitialization() {
    return this.initPromise;
  }

  async readAll() {
    await this.waitForInitialization();

    const fileContent = await fs.readFile(this.filePath, 'utf8');

    return new Promise((resolve, reject) => {
      Papa.parse(fileContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Convert string fields back to proper types
          const data = results.data.map(item => {
            return {
              ...item,
              useCustomTheme: Boolean(item.useCustomTheme),
              isPublic: item.isPublic !== undefined ? Boolean(item.isPublic) : true,
              customTheme: item.customTheme ? JSON.parse(item.customTheme) : {},
              media: item.media ? JSON.parse(item.media) : [],
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
            };
          });
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  async findById(id) {
    const allData = await this.readAll();
    return allData.find(item => item.id === id);
  }

  async findBySlug(slug) {
    const allData = await this.readAll();
    return allData.find(item => item.slug === slug);
  }

  async findAll(filters = {}) {
    const allData = await this.readAll();

    return allData.filter(item => {
      for (const [key, value] of Object.entries(filters)) {
        if (item[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  async create(data) {
    await this.waitForInitialization();

    const allData = await this.readAll();

    const newItem = {
      id: data.id || uuidv4(),
      slug: data.slug || this.generateSlug(data.name),
      createdAt: new Date().toISOString(),
      visits: 0,
      isPublic: data.isPublic !== undefined ? data.isPublic : true,
      ...data
    };

    // Convert complex objects to strings
    const itemToSave = {
      ...newItem,
      customTheme: JSON.stringify(newItem.customTheme || {}),
      media: JSON.stringify(newItem.media || [])
    };

    allData.push(itemToSave);

    await this.writeData(allData);

    // Return the item with proper types
    return {
      ...newItem,
      customTheme: newItem.customTheme || {},
      media: newItem.media || []
    };
  }

  async update(id, data) {
    await this.waitForInitialization();

    const allData = await this.readAll();
    const index = allData.findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }

    const updatedItem = {
      ...allData[index],
      ...data
    };

    // Convert complex objects to strings
    const itemToSave = {
      ...updatedItem,
      customTheme: JSON.stringify(updatedItem.customTheme || {}),
      media: JSON.stringify(updatedItem.media || [])
    };

    allData[index] = itemToSave;

    await this.writeData(allData);

    // Return the item with proper types
    return {
      ...updatedItem,
      customTheme: updatedItem.customTheme || {},
      media: updatedItem.media || []
    };
  }

  async delete(id) {
    await this.waitForInitialization();

    const allData = await this.readAll();
    const newData = allData.filter(item => item.id !== id);

    if (newData.length === allData.length) {
      throw new Error(`Item with id ${id} not found`);
    }

    await this.writeData(newData);
    return true;
  }

  async writeData(data) {
    // Convert objects to CSV
    const csv = Papa.unparse(data);

    // Add headers if file is empty or new
    const fileContent = this.getHeaders() + csv.substring(csv.indexOf('\n') + 1);

    await fs.writeFile(this.filePath, fileContent);
  }

  generateSlug(text) {
    // Convert text to slug format and add timestamp to ensure uniqueness
    const baseSlug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return `${baseSlug}-${Date.now().toString().slice(-6)}`;
  }

  async incrementVisits(slug) {
    const allData = await this.readAll();
    const index = allData.findIndex(item => item.slug === slug);

    if (index === -1) {
      throw new Error(`Page with slug ${slug} not found`);
    }

    allData[index].visits = (allData[index].visits || 0) + 1;

    await this.writeData(allData);
    return allData[index];
  }
}

module.exports = CsvStorage;