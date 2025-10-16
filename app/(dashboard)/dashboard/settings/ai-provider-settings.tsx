'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/card';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';

interface AISettings {
  xaiApiKey: string;
}

interface TestResult {
  success: boolean;
  provider?: string;
  latency?: number;
  error?: string;
  message?: string;
}

export function AIProviderSettings() {
  const [settings, setSettings] = useState<AISettings>({
    xaiApiKey: '',
  });
  const [hasApiKey, setHasApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load current settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/team/ai-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({
          xaiApiKey: '', // Never load the actual key for security
        });
        setHasApiKey(data.hasApiKey || false);
      }
    } catch (err: any) {
      console.error('Error loading AI settings:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);

    // Validate API key
    if (!settings.xaiApiKey && !hasApiKey) {
      setError('Musisz podać klucz API xAI aby korzystać z aplikacji');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/team/ai-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      setSaved(true);
      setHasApiKey(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    setError(null);

    try {
      // Prepare test data
      const testData: any = {};

      // Add xaiApiKey only if provided (otherwise backend will use stored one)
      if (settings.xaiApiKey) {
        testData.xaiApiKey = settings.xaiApiKey;
      }

      const response = await fetch('/api/team/ai-settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      setTestResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Klucz API xAI (Grok)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Aby korzystać z aplikacji AI CV Match, musisz podać swój własny klucz API xAI
          </p>
        </div>

        {/* API Key Input */}
        <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <Label htmlFor="xaiApiKey">Twój klucz API xAI</Label>
          <Input
            id="xaiApiKey"
            type="password"
            value={settings.xaiApiKey}
            onChange={(e) =>
              setSettings({ ...settings, xaiApiKey: e.target.value })
            }
            placeholder={hasApiKey ? "••••••••••••" : "xai-..."}
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {hasApiKey ? (
              <span className="text-green-600 dark:text-green-400">✅ Klucz API jest zapisany. Możesz go zmienić powyżej.</span>
            ) : (
              <>
                <strong>⚠️ Wymagany klucz API xAI:</strong> <br />
                Pobierz bezpłatnie z: <a href="https://x.ai/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://x.ai/api</a>
                <br />
                <span className="text-sm">Grok 4 Fast - szybki model do analizy CV i dopasowywania kandydatów</span>
              </>
            )}
          </p>
        </div>

        {/* Test Result */}
        {testResult && (
          <div
            className={`p-4 rounded-lg ${
              testResult.success
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{testResult.success ? '✅' : '❌'}</span>
              <div>
                <p className={`font-medium ${testResult.success ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
                  {testResult.message}
                </p>
                {testResult.success && testResult.latency && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Czas odpowiedzi: {testResult.latency}ms
                  </p>
                )}
                {!testResult.success && testResult.error && (
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {testResult.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {saved && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✅ Ustawienia zostały zapisane pomyślnie!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleTest}
            disabled={testing || loading || (!settings.xaiApiKey && !hasApiKey)}
            variant="outline"
          >
            {testing ? 'Testowanie...' : 'Testuj połączenie'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || testing}
          >
            {loading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
