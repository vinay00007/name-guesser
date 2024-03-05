'use client';
import { useState } from 'react';

const NameForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Fetch data from APIs
      const agifyResponse = await fetch(`https://api.agify.io?name=${name}`);
      const genderizeResponse = await fetch(`https://api.genderize.io?name=${name}`);
      const nationalizeResponse = await fetch(`https://api.nationalize.io?name=${name}`);

      if (!agifyResponse.ok || !genderizeResponse.ok || !nationalizeResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const agifyData = await agifyResponse.json();
      const genderizeData = await genderizeResponse.json();
      const nationalizeData = await nationalizeResponse.json();

      // Set state with fetched data
      setAge(agifyData.age.toString());
      setGender(genderizeData.gender);
      setCountry(nationalizeData.country[0]?.country_id || 'Unknown');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Name :</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} 
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
         placeholder="Enter Name " required />
      </div>

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Submit'}
      </button>

      {error && <p className="text-red-600 mt-3">{error}</p>}

      {age && gender && country && !error && (
        <div>
          <p>Age: {age}</p>
          <p>Gender: {gender}</p>
          <p>Country: {country}</p>
        </div>
      )}
    </form>
  );
};

export default NameForm;
