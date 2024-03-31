"use client";
import UpstreamsModal from "./UpstreamsModal";
import { Table } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Company {
  id: string;
  name: string;
}

const CompaniesTable = () => {
  const [isUpstreamsModalOpen, setIsUpstreamsModalOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedUpstreamType, setSelectedUpstreamType] = useState<
    string | null
  >(null);

  useEffect(() => {
    setLoading(true);
    const fetchCompanies = () => {
      axios
        .get<Company[]>("/api/companies")
        .then((response) => {
          setCompanies(response.data);
        })
        .catch((error) => {
          console.error(error);
        }).finally(() => {
          setLoading(false);
        });
    };

    fetchCompanies();
  }, []);

  const handleProvidersClick = ({ id, name }: Company) => {
    setSelectedCompany({ id, name });
    setSelectedUpstreamType("provider");
    openUpstreamsModal();
  };

  const handleSubscribersClick = ({ id, name }: Company) => {
    setSelectedCompany({ id, name });
    setSelectedUpstreamType("subscriber");
    openUpstreamsModal();
  };

  const openUpstreamsModal = () => {
    setIsUpstreamsModalOpen(true);
  };

  const closeUpstreamsModal = () => {
    setIsUpstreamsModalOpen(false);
  };

  return (
    <>
      <Table.Root id="companies">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Company</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="flex justify-end">
              Upstreams
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {companies.map((company: Company) => (
            <Table.Row key={company.id}>
              <Table.Cell>{company.name}</Table.Cell>
              <Table.Cell className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    handleProvidersClick({
                      id: company.id,
                      name: company.name,
                    });
                  }}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  Providers
                </button>
                <span>|</span>
                <button
                  onClick={() => {
                    handleSubscribersClick({
                      id: company.id,
                      name: company.name,
                    });
                  }}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  Subscribers
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
          {companies.length === 0 && !loading && (
            <Table.Row>
              <Table.Cell colSpan={2} className="text-center">
                No companies found
              </Table.Cell>
            </Table.Row>
          )}
          {loading && (
            <Table.Row>
              <Table.Cell colSpan={2}>
                <Skeleton height={40} count={3} />
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
      {selectedCompany && (
        <UpstreamsModal
          isOpen={isUpstreamsModalOpen}
          handleClose={closeUpstreamsModal}
          company={selectedCompany}
          upStreamType={selectedUpstreamType}
          allCompanies={companies}
        />
      )}
    </>
  );
};

export default CompaniesTable;
