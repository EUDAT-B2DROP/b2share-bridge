<?php

declare(strict_types=1);

namespace OCA\B2shareBridge\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\SimpleMigrationStep;
use OCP\Migration\IOutput;

class Version010100Date20200130114400 extends SimpleMigrationStep {

    /** @var IDBConnection */
    protected $connection;

    /** @var IConfig */
    protected $config;

    /**
     * @param IDBConnection $connection
     * @param IConfig $config
     */
    public function __construct(IDBConnection $connection, IConfig $config) {
        $this->connection = $connection;
        $this->config = $config;
    }

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options) {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if (!$schema->hasTable('b2sharebridge_server')) {
			$table = $schema->createTable('b2sharebridge_server');
			$table->addColumn('id', 'bigint', [
				'autoincrement' => true,
				'notnull' => true,
				'length' => 64,
			]);
			$table->addColumn('name', 'string', [
				'notnull' => true,
				'length' => 64,
				'default' => '',
			]);
			$table->addColumn('publish_url', 'string', [
				'notnull' => true,
                'length' => 64,
                'default' => '',
			]);
		}
		return $schema;
	}

}
