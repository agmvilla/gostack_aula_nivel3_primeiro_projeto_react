import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Header, RepositoryInfo, Issues } from './styles';

import api from '../../services/api';
import logo from '../../assets/logo.svg';

interface RepositoryParams {
    repository: string;
}

interface Repository {
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    owner: {
        login: string;
        avatar_url: string;
    }
}

interface Issue {
    id: number;
    title: string;
    html_url: string;
    user: {
        login: string;
    }
}

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssue] = useState<Issue[]>([]);

  const { params } = useRouteMatch<RepositoryParams>();

  useEffect(() => {
    // Como essas duas chamadas de api não dependem uma da outra é interessante que elas seja executadas em paralelo e
    // não de maneira sequencial, por isso está usando o ".then" abaixo
    api.get(`repos/${params.repository}`).then((response) => {
      setRepository(response.data);
    });

    api.get(`repos/${params.repository}/issues`).then((response) => {
      setIssue(response.data);
    });

    /**
     * As mesmas chamadas acima pderiam ser feitas da seguitne maneira usando await e promise.all
     */

    // async function loadData(): Promise<void> {
    //   const [repository, issues] = await Promise.all([
    //     api.get(`repos/${params.repository}`),
    //     api.get(`repos/${params.repository}/issues`),
    //   ]);
    //   console.log(repository, issues);
    // }

    // loadData();

    //* * End Demo code for Promise.all */
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={logo} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>
      { repository && (
        <RepositoryInfo>
          <header>
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>

          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>

        </RepositoryInfo>
      )}

      <Issues>
        {
            issues.map((issue) => (
              <a key={issue.id} href={issue.html_url}>
                <div>
                  <strong>{issue.title}</strong>
                  <p>{issue.user.login}</p>
                </div>

                <FiChevronRight size={20} />
              </a>
            ))
        }

      </Issues>
    </>
  );
};

export default Repository;
